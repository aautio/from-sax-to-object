const { parse, pickFirst, pickAll } = require("../");

const expect = require("chai").expect;

describe("Selector tests", function() {
  before(async function() {
    const result = await parse(
      '<hello zip="zap">world<inner/>foo<inner id="2"/>kick<last><deep><nested>surprise</nested></deep></last></hello>'
    );

    expect(result).to.deep.equal({
      name: "hello",
      children: [
        { text: "world" },
        { name: "inner" },
        { text: "foo" },
        { name: "inner", attrs: { id: "2" } },
        { text: "kick" },
        {
          name: "last",
          children: [
            {
              name: "deep",
              children: [{ name: "nested", children: [{ text: "surprise" }] }]
            }
          ]
        }
      ],
      attrs: { zip: "zap" }
    });

    this.parsed = result;
  });

  it("Can pick individual items from root", function() {
    expect(pickFirst(this.parsed, "hello")).to.deep.equal(this.parsed);
  });

  it("Can pick individual items child nodes also", function() {
    const last = pickFirst(this.parsed, "last");
    expect(last).to.deep.equal({
      name: "last",
      children: [
        {
          name: "deep",
          children: [{ name: "nested", children: [{ text: "surprise" }] }]
        }
      ]
    });

    const nested = pickFirst(last, "nested");
    expect(nested).to.deep.equal({
      name: "nested",
      children: [{ text: "surprise" }]
    });
  });

  it("Can pick individual items from children", function() {
    expect(pickFirst(this.parsed, "inner")).to.deep.equal({ name: "inner" });
  });

  it("Can pick all items from root", function() {
    expect(pickAll(this.parsed, "hello")).to.deep.equal([this.parsed]);
  });

  it("Can pick all items from children", function() {
    expect(pickAll(this.parsed, "inner")).to.deep.equal([
      { name: "inner" },
      { name: "inner", attrs: { id: "2" } }
    ]);
  });

  it("pickFirst returns null when none is found", function() {
    expect(pickFirst(this.parsed, "NOTFOUND")).to.be.null;
  });

  it("pickAll returns [] when none is found", function() {
    expect(pickAll(this.parsed, "NOTFOUND")).to.deep.equal([]);
  });
});
