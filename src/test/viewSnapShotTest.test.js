import React from "react";
import Graph from "../component/Graph";
import renderer from "react-test-renderer";

test("Test Graph Component", ()=>{
	let tree=renderer.create(<Graph />).toJSON();
	expect(tree).toMatchSnapshot();
});