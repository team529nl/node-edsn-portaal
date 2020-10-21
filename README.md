# node-edsn-portaal

EDSN Portaal interface

You might want to consider the go version, because ordering is only correct when the input JSON is in the right order.
(This is done / needed in `message.ts`)

### Creating types
Install: `npm install -g xml2json && npm install -g maketypes`

- Generate example xml with IntelliJ
- Generate json from xml: `for f in $(ls *.xml); do cat $f | xml2json > $(basename $f .xml).json; done`
- Cleanup json: remove urn field (or remove attribute from example xml)
- Generate ts from json: `for f in $(ls *.json); do make_types -i $(basename $f .xsd.json).ts $f dummy; done`
- Cleanup ts: remove dummy
- Set optional fields in ts.
- Filter duplicates, extract common fields

### Soap client errors.
If the Async method does not exists, check if the service name is the same as the operation name. If so, rename (ie. add Service) the service name.
