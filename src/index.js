export default {
  id: "api",
  handler: async (router, { services, exceptions }) => {
    const { ItemsService } = services;

    router.get("/:field", async (req, res, next) => {
      const {
        params: { field },
        query: {  subfield = [], lang},
        schema,
        accountability,
      } = req;

      if (!subfield) {
        return res.status(400).json({
          error: "Missing required parameter: subfield",
        });
      }

      if (!lang) {
        return res.status(400).json({
          error: "Missing required parameter: language",
        });
      }

      const relationsService = new ItemsService("directus_relations", {
        schema,
        accountability,
      });

      const fieldsService = new ItemsService("directus_fields", {
        schema,
        accountability,
      });
      const subfieldArray = Array.isArray(subfield) ? subfield : [subfield];


      // Get the collection data for a given collection
      async function getCollectionData(collection) {
        const collectionData = await fieldsService.readByQuery({
          filter: { collection: { _eq: collection } },
        });
        return collectionData.map(({ field }) => field);
      }

      // Get the many collection for a given field
      async function getManyCollection(field) {
        const relationData = await relationsService.readByQuery({
          filter: { one_field: { _eq: field } },
        });
        return relationData?.[0]?.many_collection;
      }

      // Get the translation for a given language
      function getTranslation(translations, lang, sub) {
        const labelObj = translations.filter((tr) => tr.language === lang);
        const returnLabel = labelObj && labelObj[0] ? labelObj[0].translation : sub
        return returnLabel
      }

      const dateTimeFields = await getCollectionData("date_time");

      const labelArray = [];
      for (const sub of subfieldArray) {
        if (sub === "translations") {
          const collectionData = await fieldsService.readByQuery({
            filter: { collection: { _eq: "options" } },
          });
          const { translations } = collectionData.find(
              ({ field }) => field === sub
          ) || {};
          const label = getTranslation(translations, lang);
          const obj = { [sub]: label };
          labelArray.push(obj);
        } else if (dateTimeFields.includes(sub)) {
          const { translations } =
          dateTimeFields.find(({ field }) => field === sub) || {};
          const label = getTranslation(translations, lang);
          const obj = { [sub]: label };
          labelArray.push(obj);
        } else {
          const manyCollection = await getManyCollection(field);
          const collectionData = await fieldsService.readByQuery({
            filter: { collection: { _eq: manyCollection } },
          });
          const { translations } = collectionData.find(
              ({ field }) => field === sub
          ) || {};
          const label = translations ? getTranslation(translations, lang) : null
          const obj = { [sub]: label};
          labelArray.push(obj);
        }
      }

      res.send(labelArray);
      next();
    });
  },
};
