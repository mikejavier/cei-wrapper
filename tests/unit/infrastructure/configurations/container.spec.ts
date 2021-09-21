import { Container } from "inversify";
import { createContainer } from "../../../../src/infrastructure/configurations/container";

const bindMock = jest.fn().mockReturnValue({ toConstantValue: jest.fn(), toSelf: jest.fn() });

jest.mock("inversify", () => {
  const originalModule = jest.requireActual("inversify");

  return {
    ...originalModule,
    Container: jest.fn().mockImplementation(() => ({
      bind: bindMock,
    })),
  };
});

describe("Container", () => {
  it("Should create container successfully", () => {
    const container = createContainer();

    expect(Container).toBeCalledTimes(1);
    expect(bindMock).toBeCalledTimes(7);
    expect(container).toHaveProperty("bind");
  });
});
