const { parse } = require("../");

const expect = require("chai").expect;

describe("Parser tests", function() {
  it("parses <hello/>", async function() {
    const result = await parse("<hello/>");

    expect(result).to.deep.equal({
      name: "hello"
    });
  });

  it("parses xml and doctype declarations", async function() {
    const result = await parse(
      `
      <?xml version="1.0" encoding="UTF-8" standalone="no" ?>
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <hello/>
      `
    );

    expect(result).to.deep.equal({
      name: "hello"
    });
  });

  it("parses <hello>world</hello>", async function() {
    const result = await parse("<hello>world</hello>");

    expect(result).to.deep.equal({
      name: "hello",
      children: [{ text: "world" }]
    });
  });

  it("parses <hello><hello/></hello>", async function() {
    const result = await parse("<hello><hello/></hello>");

    expect(result).to.deep.equal({
      name: "hello",
      children: [{ name: "hello" }]
    });
  });

  it('parses <hello zip="zap">world<inner/>foo</hello>', async function() {
    const result = await parse('<hello zip="zap">world<inner/>foo</hello>');

    expect(result).to.deep.equal({
      name: "hello",
      children: [{ text: "world" }, { name: "inner" }, { text: "foo" }],
      attrs: { zip: "zap" }
    });
  });

  it('parses <hello zip="zap">world<inner/>foo<inner/>kick</hello>', async function() {
    const result = await parse(
      '<hello zip="zap">world<inner/>foo<inner id="2"/>kick</hello>'
    );

    expect(result).to.deep.equal({
      name: "hello",
      children: [
        { text: "world" },
        { name: "inner" },
        { text: "foo" },
        { name: "inner", attrs: { id: "2" } },
        { text: "kick" }
      ],
      attrs: { zip: "zap" }
    });
  });

  it("parses <demo><![CDATA[HELLO YOU & ME < > !<foo/></bar><zap>]]></demo>", async function() {
    const result = await parse(
      "<demo><![CDATA[HELLO YOU & ME < > !<foo/></bar><zap>]]></demo>"
    );

    expect(result).to.deep.equal({
      name: "demo",
      children: [{ text: "HELLO YOU & ME < > !<foo/></bar><zap>" }]
    });
  });
});
