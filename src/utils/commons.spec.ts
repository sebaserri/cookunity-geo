import { isValidIP } from "./commons";

describe("Commons isValidIP", () => {
  it("should return true for valid IPs", () => {
    expect(isValidIP("127.0.0.1")).toBe(true);
    expect(isValidIP("192.168.1.1")).toBe(true);
    expect(isValidIP("255.255.255.255")).toBe(true);
  });

  it("should return false for invalid IPs", () => {
    expect(isValidIP("256.256.256.256")).toBe(false);
    expect(isValidIP("192.168.1")).toBe(false);
    expect(isValidIP("123.456.78.90")).toBe(false);
    expect(isValidIP("abc.def.ghi.jkl")).toBe(false);
    expect(isValidIP("")).toBe(false);
  });
});
