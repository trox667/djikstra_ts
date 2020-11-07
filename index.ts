// http://www.orklaert.de/dijkstra-algorithmus.php
// https://www.vogella.com/tutorials/JavaAlgorithmsDijkstra/article.html#model
class Vertex {
    constructor(public id: string, public name: string) {}
}

class Edge {
    constructor(
        public id: string,
        public source: Vertex,
        public destination: Vertex,
        public weight: number,
    ) {}
}

class Graph {
    constructor(public vertices: Array<Vertex>, public edges: Array<Edge>) {}
}

class Djikstra {
    private nodes: Array<Vertex>
    private edges: Array<Edge>
    private settledNodes: Set<Vertex>
    private unsettledNodes: Set<Vertex>
    private predecessors: Map<string, Vertex>
    private distance: Map<string, number>

    constructor(graph: Graph) {
        this.nodes = graph.vertices
        this.edges = graph.edges
    }

    public run(source: Vertex) {
        this.settledNodes = new Set()
        this.unsettledNodes = new Set()
        this.distance = new Map()
        this.predecessors = new Map()

        this.distance.set(source.id, 0)
        this.unsettledNodes.add(source)

        while (this.unsettledNodes.size > 0) {
            const node = this.getMinimum(this.unsettledNodes)
            this.settledNodes.add(node)
            this.unsettledNodes.delete(node)
            this.findMinimalDistance(node)
        }

        console.log(this.distance)
    }

    private findMinimalDistance(node: Vertex) {
        let adjacentNodes = this.getNeighbors(node)
        for (let target of adjacentNodes) {
            if (
                this.getShortestDistance(target) >
                this.getShortestDistance(node) + this.getDistance(node, target)
            ) {
                this.distance.set(
                    target.id,
                    this.getShortestDistance(node) +
                        this.getDistance(node, target),
                )
                this.predecessors.set(target.id, node)
                this.unsettledNodes.add(target)
            }
        }
    }

    private getDistance(node: Vertex, target: Vertex): number {
        for (let edge of this.edges) {
            if (edge.source.id === node.id && edge.destination.id === target.id)
                return edge.weight
        }
    }

    private getNeighbors(node: Vertex): Array<Vertex> {
        let neighbors = []
        for (let edge of this.edges)
            if (edge.source.id === node.id && !this.isSettled(edge.destination))
                neighbors.push(edge.destination)
        return neighbors
    }

    private getMinimum(vertices: Set<Vertex>): Vertex {
        let minimum = null
        for (let vertex of vertices) {
            if (minimum === null) minimum = vertex
            else if (
                this.getShortestDistance(vertex) <
                this.getShortestDistance(minimum)
            )
                minimum = vertex
        }
        return minimum
    }

    private isSettled(vertex: Vertex): boolean {
        return this.settledNodes.has(vertex)
    }

    private getShortestDistance(destination: Vertex): number {
        const d = this.distance.get(destination.id)
        if (d == null) return Number.MAX_SAFE_INTEGER
        else return d
    }

    public getPath(target: Vertex): Array<string> {
        let path = []
        let step = target

        if (this.predecessors.get(step.id) === null) return null
        path.push(step.id)
        while (step !== undefined && this.predecessors.get(step.id) != null) {
            step = this.predecessors.get(step.id)
            path.push(step.id)
        }

        return path.reverse()
    }
}

function test() {
    const nodes = []
    const edges = []

    const addLane = (
        laneId: string,
        sourceLocNo: number,
        destLocNo: number,
        duration: number,
    ) => {
        const lane = new Edge(
            laneId,
            nodes[sourceLocNo],
            nodes[destLocNo],
            duration,
        )
        edges.push(lane)
    }

    nodes.push(new Vertex('A', 'A'))
    nodes.push(new Vertex('B', 'B'))
    nodes.push(new Vertex('C', 'C'))
    nodes.push(new Vertex('D', 'D'))
    nodes.push(new Vertex('E', 'E'))

    addLane('AB', 0, 1, 10)
    addLane('AD', 0, 3, 80)
    addLane('BE', 1, 4, 20)
    addLane('BC', 1, 2, 50)
    addLane('DC', 3, 2, 50)
    addLane('CE', 2, 4, 50)
    addLane('EC', 4, 2, 20)
    addLane('ED', 4, 3, 40)

    /*
    for (let i = 0; i < 11; i++) {
        let location = new Vertex(`Node_${i}`, `Node_${i}`)
        nodes.push(location)
    }

    addLane('Edge_0', 0, 1, 85)
    addLane('Edge_1', 0, 2, 217)
    addLane('Edge_2', 0, 4, 173)
    addLane('Edge_3', 2, 6, 186)
    addLane('Edge_4', 2, 7, 103)
    addLane('Edge_5', 3, 7, 183)
    addLane('Edge_6', 5, 8, 250)
    addLane('Edge_7', 8, 9, 84)
    addLane('Edge_8', 7, 9, 167)
    addLane('Edge_9', 4, 9, 502)
    addLane('Edge_10', 9, 10, 40)
    addLane('Edge_11', 1, 10, 600)
*/
    const graph = new Graph(nodes, edges)
    const djikstra = new Djikstra(graph)

    djikstra.run(nodes[0])
    //const path = djikstra.getPath(nodes[10])
    const path = djikstra.getPath(nodes[4])
    console.assert(path !== null)
    console.assert(path.length > 0)

    for (let p of path) console.log(p)
}

test()
