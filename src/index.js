
//DOCS
// https://docs.directus.io/extensions/endpoints.html
// https://docs.directus.io/extensions/creating-extensions.html
// re

//returns relations data - many_collection by one_field
export default {
  id: "api",
  handler: (router, { services, exceptions }) => {
    const { ItemsService } = services;
    router.get("/", (req, res) => res.send("directus-custom-api"));
    router.get("/:field", async function (req, res, next) {
      const relationsService = new ItemsService("directus_relations", {
        schema: req.schema,
        accountability: req.accountability,
      });
      const field = req.params.field
      const relationData = await relationsService.readByQuery({
        filter: { one_field: { _eq: field } },
      });
      const manyCollection = relationData && relationData[0] ? relationData[0].many_collection : null
      res.send(manyCollection)
    });
  },
};
