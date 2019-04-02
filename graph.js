var color = 'gray';
var len = undefined;
// var nodes = [{ id: 0, label: "0" },
// { id: 1, label: "1", color: 'black' },
// { id: 2, label: "2" },
// { id: 3, label: "3" },
// { id: 4, label: "4" },
// { id: 5, label: "5" },
// { id: 6, label: "6" },
// { id: 7, label: "7" },
// { id: 8, label: "8" },
// { id: 9, label: "9" },
// { id: 10, label: "10" },
// { id: 11, label: "11" },
// { id: 12, label: "12" },
// { id: 13, label: "13" },
// { id: 14, label: "14" },
// { id: 15, label: "15" },
// { id: 16, label: "16" },
// { id: 17, label: "17" },
// { id: 18, label: "18" },
// { id: 19, label: "19" },
// { id: 20, label: "20" },
// { id: 21, label: "21" },
// { id: 22, label: "22" },
// { id: 23, label: "23" },
// { id: 24, label: "24" },
// { id: 25, label: "25" },
// { id: 26, label: "26" },
// { id: 27, label: "27" },
// { id: 28, label: "28" },
// { id: 29, label: "29" }
// ];
// var edges = [{ from: 1, to: 0 },
// { from: 2, to: 0 },
// { from: 4, to: 3 },
// { from: 5, to: 4 },
// { from: 4, to: 0 },
// { from: 7, to: 6 },
// { from: 8, to: 7 },
// { from: 7, to: 0 },
// { from: 10, to: 9 },
// { from: 11, to: 10 },
// { from: 10, to: 4 },
// { from: 13, to: 12 },
// { from: 14, to: 13 },
// { from: 13, to: 0 },
// { from: 16, to: 15 },
// { from: 17, to: 15 },
// { from: 15, to: 10 },
// { from: 19, to: 18 },
// { from: 20, to: 19 },
// { from: 19, to: 4 },
// { from: 22, to: 21 },
// { from: 23, to: 22 },
// { from: 22, to: 13 },
// { from: 25, to: 24 },
// { from: 26, to: 25 },
// { from: 25, to: 7 },
// { from: 28, to: 27 },
// { from: 29, to: 28 },
// { from: 28, to: 0 }
// ]
nodes = [];
edges = [];
var connectionCount = [];

// randomly create some nodes and edges
var nodeCount = 25;
for (var i = 0; i < nodeCount; i++) {
    nodes.push({
        id: i,
        label: String(i)
    });

    connectionCount[i] = 0;

    // create edges in a scale-free-network way
    if (i == 1) {
        var from = i;
        var to = 0;
        edges.push({
            from: from,
            to: to
        });
        connectionCount[from]++;
        connectionCount[to]++;
    }
    else if (i > 1) {
        var conn = edges.length * 2;
        var rand = Math.floor(Math.random() * conn);
        var cum = 0;
        var j = 0;
        while (j < connectionCount.length && cum < rand) {
            cum += connectionCount[j];
            j++;
        }

        var from = i;
        var to = j;
        edges.push({
            from: from,
            to: to
        });
        connectionCount[from]++;
        connectionCount[to]++;
    }
}
// create a network
var container = document.getElementById('mynetwork');
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    nodes: {
        shape: 'dot',
        size: 30,
        font: {
            size: 32,
            color: '#ffffff'
        },
        borderWidth: 2
    },
    edges: {
        width: 2
    },
    manipulation: {
        enabled: true,
        addNode: function (nodeData, callback) {
            nodeData.label = nodeData.id
            callback(nodeData);
        },
        addEdge: function (edgeData, callback) {
            if (edgeData.from === edgeData.to) {
                var r = confirm("Do you want to connect the node to itself?");
                if (r === true) {
                    callback(edgeData);
                }
            }
            else {
                callback(edgeData);
            }
        },
        deleteNode: true
    }
};
network = new vis.Network(container, data, options);

//Global variables for BFS
var visited = []
var neighbors = []
var color = 0

//Events
network.on('select', function (params) {
    color = (color == 0 ? 1 :  0)
    visited = []
    neighbors = []
    visited.push(params.nodes[0])
    console.log(params)
    console.log('visited = ' + visited)
    neighbors = network.getConnectedNodes(params.nodes[0])
    console.log('neighbors =  ' + neighbors)

    bfs(visited[0])
});

network.on('animationFinished', function () {
    console.log('finalizou')
    console.log('initial neighbors = ' + neighbors)
    if(neighbors[0] >= 0){
        var next = neighbors[0]
        var nextNeighbors = []
        nextNeighbors = network.getConnectedNodes(next)
        console.log('next neighbors = ' + nextNeighbors)

        visited.push(next)
        nextNeighbors.forEach(element => {
            if (!visited.includes(element)){
                neighbors.push(element)
            }
        });
        neighbors.shift()
        console.log('final neighbors = ' + neighbors)
        bfs(next)
    }
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function bfs(value) {
    if (color == 1){
        network.clustering.updateClusteredNode(value, { color: { background: 'red', highlight: { background: 'red' } } })
    } else {
        network.clustering.updateClusteredNode(value, { color: { background: '#ffffff', highlight: { background: '#ffffff' } } })
    }
    var options = {
        scale: 1,
        // animation: true
        animation: {
            duration: 1800,
            // easingFunction: linear
        }
    }
    network.focus(value, options)
}