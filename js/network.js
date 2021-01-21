let network;
let nodes;
let doneNodes = [];
let edges;
let curSearch = ''
const networkDom = e("#network");

// network options
const options = {
    nodes: {
        shape: "dot",
        scaling: {
            min: 20,
            max: 30,
            label: { min: 14, max: 30, drawThreshold: 9, maxVisible: 20 },
        },
        color: {
            border: "#2B7CE9",
            background: "#97C2FC",
            highlight: {
                border: "#2B7CE9",
                background: "#D2E5FF",
            },
            hover: {
                border: "#2B7CE9",
                background: "#D2E5FF",
            },
        },
    },
    interaction: {
        hover: true,
        hoverConnectedEdges: false,
        selectConnectedEdges: true,
    },
};

const getNodesTrace = (node) => {
    let curNode = node;
    let finished = false;
    const traces = [];
    while (!finished) {
        if (nodes.get(curNode)) {
            traces.push(curNode);
            const { level, parent } = nodes.get(curNode);
            if (level === 0) {
                finished = true;
                break;
            }
            curNode = parent;
        } else {
            finished = true;
        }
    }
    return traces;
};

const getEdgesTrace = (traceNodes) => {
    traceNodes.reverse();
    const traces = [];

    for (let i = 0; i < traceNodes.length - 1; i += 1) {
        traces.push(getEdgeConnecting(traceNodes[i], traceNodes[i + 1]));
    }
    return traces;
};

const getEdgeConnecting = (a, b) => {
    const edge = edges.get({
        filter: (e) => e.from === a && e.to === b,
    })[0];

    return (edge instanceof Object ? edge : {}).id;
};

const setNodesColor = (ns, isHover) => {
    for (const node of ns) {
        node.color = isHover ? "#FFC107" : "#97C2FC";
        delete node.x;
        delete node.y;
    }
    nodes.update(ns);
};

const setEdgesWidth = (es, width) => {
    for (const edge of es) {
        edge.width = width;
    }

    edges.update(es);
};

const bindNetwork = () => {
    network.on("click", (params) => {
        if (params.nodes.length) {
            const page = params.nodes[0];
            if (doneNodes.includes(page)) {
                log(doneDescription)
                showDescription(doneDescription[page])
                return;
            }

            const { label, level } = nodes.get(page);
            addNodes(label, level);
        } else {
            pageContainer.innerHTML = "";
        }
    });
    network.on("hoverNode", (params) => {
        activeNetworkHover(params.node);
    });
    network.on("blurNode", clearNetworkHover);
    network.on("doubleClick", (params) => {
        if (params.nodes.length) {
            const title = params.nodes[0];
            openUrl(title);
        }
    });
};

const activeNetworkHover = (node) => {
    let nodesTrace = getNodesTrace(node);
    let edgesTrace = getEdgesTrace(nodesTrace);
    window.modNodes = nodesTrace.map((item) => nodes.get(item));
    window.modEdges = edgesTrace.map((i) => {
        const e = edges.get(i);
        e.color = { inherit: "to" };
        return e;
    });
    setNodesColor(window.modNodes, true);
    setEdgesWidth(modEdges, 4);
};

const clearNetworkHover = () => {
    if (window.modNodes.length < 1) return;
    setNodesColor(window.modNodes, false);
    setEdgesWidth(window.modEdges, 1);
    window.modNodes = [];
    window.modEdges = [];
};

const clearNetwork = () => {
    nodes = new vis.DataSet();
    edges = new vis.DataSet();
    data = { nodes, edges };
    network.setData(data);
};

const searchNetwork = (value) => {
    value = value.toLowerCase();
    nodes.add([{
        id: value,
        label: value,
        value: 2,
        level: 0,
        x: 0,
        y: 0,
        parent: value,
    }, ]);
    doneNodes.push(value);
};

const addNodes = (label, level) => {
    Toast.show(Config.language == "en" ? "loading..." : "加载中...");
    curSearch = label
    getLinks(label).then((links) => {
        if (links.length === 0) {
            Toast.show(Config.language == "en" ? "no relevant" : "没有相关页面");
        } else {
            Toast.hide();
        }
        const newNodes = [];
        const newEdges = [];
        links = Array.from(new Set(links));

        for (const link of links) {
            const element = decodeURIComponent(link).toLowerCase();

            if (!nodes.getIds().includes(element)) {
                newNodes.push({
                    id: element,
                    label: element,
                    value: 1,
                    level: level + 1,
                    parent: label,
                });
            }
            if (!getEdgeConnecting(label, element)) {
                newEdges.push({
                    from: label,
                    to: element,
                    level: level + 1,
                    selectionWidth: 2,
                    hoverWidth: 0,
                });
            }
        }

        nodes.add(newNodes);
        edges.add(newEdges);
        doneNodes.push(label);
    });
};

const initNetWork = () => {
    nodes = new vis.DataSet();
    edges = new vis.DataSet();
    data = { nodes, edges };
    network = new vis.Network(networkDom, data, options);
    network.setData(data);

    bindNetwork();
};