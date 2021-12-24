// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// adding Enzyme setup here so that it runs before every tests
import Enzyme from "enzyme";

// to help translate react code into Enzyme code
import EnzymeAdapter from "@wojtekmaj/enzyme-adapter-react-17";

// configure Enzyme
Enzyme.configure({ adapter: new EnzymeAdapter() });
