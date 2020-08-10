import WeightedAlgo from "../WeightedAlgo";

test('Check setup init value of weighted Algoritem', () => {
    //setup adjcentcylist look like:
    //       0_0  ---  1_0
    //        |         |
    //       0_1  ---  1_1

    let adjList = {
        "0_0":[{node:"1_0",weight:1},{node:"0_1",weight:1}],
        "1_0":[{node:"0_0",weight:1},{node:"1_1",weight:1}],
        "0_1":[{node:"0_0",weight:1},{node:"1_1",weight:1}],
        "1_1":[{node:"1_0",weight:1},{node:"0_1",weight:1}]
    }

    let startNode = "0_0";
    let endNode = "1_1";

    let wAlgo = new WeightedAlgo(adjList,startNode,endNode);

    wAlgo.setupInitState();

    expect(wAlgo.distances["0_0"]).toBe(0);
    expect(wAlgo.distances["1_0"]).toBe(Infinity);
    expect(wAlgo.distances["0_1"]).toBe(Infinity);
    expect(wAlgo.distances["1_1"]).toBe(Infinity);
    expect(wAlgo.previous["0_0"]).toBe(null);
    expect(wAlgo.previous["1_0"]).toBe(null);
    expect(wAlgo.previous["0_1"]).toBe(null);
    expect(wAlgo.previous["1_1"]).toBe(null);
    expect(wAlgo.pQueue.dequeue().val).toBe("0_0");
    expect(wAlgo.pQueue.dequeue().priority).toBe(Infinity);
    expect(wAlgo.pQueue.dequeue().priority).toBe(Infinity);
    expect(wAlgo.pQueue.dequeue().priority).toBe(Infinity);
})