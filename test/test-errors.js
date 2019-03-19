const { parse } = require("../");

const chai = require("chai");
chai.use(require("chai-as-promised"));
const expect = chai.expect;

describe("Invalid XML is rejected", function() {
  const invalidXmls = [
    "<hello>",
    "</hello>",
    "<hello></world>",
    "<hello></hello><hello/>",
    "oi<hello/>",
    "<hello/>!",
    "foo",
    " ",
    "<![CDATA[hello]]>",
    "<![CDATA[]]><hello/>",
    "<![CDATA[ ]]><hello/>",
    '<?xml version="1.0" ?><?xml version="1.0" ?><hello/>',
    null,
    undefined
  ];

  for (const xml of invalidXmls) {
    it(`should reject ${xml}`, function() {
      return expect(parse(xml)).to.eventually.be.rejected;
    });
  }
});
