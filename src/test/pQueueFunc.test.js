import PriortyQueue from "../PriorityQueue"

test('Check Priorty Queue function', () => {
    let pQueue = new PriortyQueue();
    pQueue.enqueue(5,3);
    pQueue.enqueue(10,1);
    pQueue.enqueue(20,2);
    pQueue.enqueue(100,4);

    expect(pQueue.dequeue().val).toBe(10);
    expect(pQueue.dequeue().val).toBe(20);
    expect(pQueue.dequeue().val).toBe(5);
    expect(pQueue.dequeue().val).toBe(100);
})