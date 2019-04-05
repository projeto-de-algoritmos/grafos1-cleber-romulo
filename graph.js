var color = 'gray';
var len = undefined;

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
            nodeData.label = ""
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
            duration: 800,
            // easingFunction: linear
        }
    }
    network.focus(value, options)
}