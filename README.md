# API Documentation<br>
<br>
GET /api/:field?subfield&lang<br>
<br>
**The API is meant for getting related many_collection field data by one_field fieldname.**<br>
<br>
Returns an array of objects containing the translated labels for the specified subfield parameter for the given one_field parameter. Both field, subfield, and lang parameters are mandatory.
<br>
### Parameters<br>
<br>
- field (mandatory) - Specifies the field that is **one_field** of the **many_collection** for which the fieldlabel translations are requested.<br>
- subfield (mandatory) - Specifies the subfield for which the translations are requested. If there are multiple subfields, this parameter can be repeated as many times as necessary.<br>
- lang (mandatory) - Specifies the language in which to return the translated labels. Directus official language codes have to be used. (Eg. en-US)<br>
<br>
### Response<br><br>
An array of objects, where each object contains a single key-value pair. The key is the name of the requested subfield, and the value is the translated label for that subfield in the requested lang. If a subfield does not have a translation, its value in the response object will be null.<br>
<br>
### Example Reques <br>
GET /api/field_name?subfield=subfield1&subfield=subfield2&lang=ee-ET<br>
<br>
### Example Response<br>
<br>
```javascript
[
{
"subfield1": "Translated Label 1"
},
{
"subfield2": "Translated Label 2"
}
]
```
<br>
#### Error Handling
If the field parameter is not provided or is invalid, the API will respond with a 400 Bad Request status code. <br>
<br>
