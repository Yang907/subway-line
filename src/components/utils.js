import { Graph } from "@antv/x6";
import { Stencil } from "@antv/x6-plugin-stencil";
import { Transform } from "@antv/x6-plugin-transform";
import { Keyboard } from "@antv/x6-plugin-keyboard";
import { History } from "@antv/x6-plugin-history";
import { Selection } from "@antv/x6-plugin-selection";
import insertCss from "insert-css";

let edge = null;
let node = null;
let graph = null;

// 注册自定义节点
Graph.registerNode(
  "car-node",
  {
    // width: 30,
    // height: 30,
    label: "列车",
    attrs: {
      body: {
        stroke: "#5F95FF",
        strokeWidth: 1,
        fill: "green",
        refWidth: 1,
        refHeight: 1,
        r: 15,
      },
      image: {
        "xlink:href": require("@/assets/car.png"),
        width: 16,
        height: 16,
        x: -9,
        y: -7,
      },
    },
    markup: [
      {
        tagName: "circle",
        selector: "body",
      },
      {
        tagName: "image",
        selector: "image",
      },
    ],
  },
  true
);
// 注册自定义节点
Graph.registerNode(
  "custom-node",
  {
    width: 200,
    height: 60,
    label: "站点",
    attrs: {
      body: {
        strokeWidth: 1,
        strokeDasharray: 0,
        stroke: "rgba(255,255,255,0.1)",
        fill: "rgba(0,0,0,0.9)",
      },
      circle: {
        r: 5,
        text: "11",
        cx: 10,
        cy: 14,
        fill: "#fff",
        stroke: "#5F95FF",
      },
      text: {
        text: "站点",
        refX: 20,
        refY: 9,
        fontSize: 14,
        fill: "#000",
        "text-anchor": "start",
      },
      label: {
        text: "",
      },
    },
    markup: [
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "circle",
        selector: "circle",
      },
      {
        tagName: "text",
        selector: "text",
      },
    ],
    // tools: [
    //   {
    //     name: "node-editor",
    //     args: {
    //       getText: "text/text",
    //       setText: "text/text",
    //     },
    //   },
    // ],
  },
  true
);
// 注册T型节点
Graph.registerNode("t-node", {
  inherit: "polygon", // 继承多边形基础节点
  width: 60,
  height: 80,
  attrs: {
    body: {
      stroke: "#000",
      strokeWidth: 1,
      fill: "#ffffff",
      // 定义T型路径 (x,y)
      points: "8,0 50,0 50,10 36,10 36,30 22,30 22,10 8,10",
    },
    label: {
      text: "电车",
      fill: "#000",
      fontSize: 12,
      // textAlign: "center",
      dx: -3,
      "writing-mode": "vertical-rl",
      transform: "translate(0, -10)",
    },
  },
});
export function initGraph(wrapper) {
  return new Graph({
    container: document.getElementById(wrapper),
    width: "100%",
    height: "100%",
    autoResize: true,
    grid: {
      visible: true,
      type: "doubleMesh", // 网格类型
      args: [
        {
          color: "#ddd", // 主网格线颜色
          thickness: 1, // 主网格线宽度
        },
        {
          color: "#eee", // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 4, // 次网格线间隔倍数
        },
      ],
    },
    background: {
      color: "#F2F7FA",
    },
    // 调整节点大小
    resizing: {
      enabled: true,
    },
    mousewheel: {
      enabled: true,
      modifiers: ["ctrl", "meta"],
    },
    panning: true,
    interacting: true, //是否启用交互
    snapline: true, // 对齐线
  });
}

// 注册插件
export function initPlugIns(graph) {
  graph.use(
    new Transform({
      // resizing: true,
      // rotating: true,
    })
  );
  graph.use(
    new Keyboard({
      enabled: true,
    })
  );
  graph.use(
    new History({
      enabled: true,
    })
  );
  graph.use(
    new Selection({
      enabled: true,
      showNodeSelectionBox: true,
      pointerEvents: "none",
    })
  );
  graph.setSelectionFilter((cell) => {
    return cell.shape !== "car-node";
  });
}

// 初始化组件栏
export function initStencil(graph) {
  return new Stencil({
    title: "组件",
    target: graph,
    groups: [
      {
        name: "标记",
        graphHeight: 200,
      },
      {
        name: "站点",
        graphHeight: 300,
        // layoutOptions: {
        //   columns: 4,
        //   dx: 1,
        //   marginX: 1,
        // },
        // layout: (model) => {
        //   console.log(model);
        //   const nodes = model.collection.cells;
        //   nodes.forEach((item, index) => {
        //     item.position(
        //       (index % 4) * 50,
        //       20 * (Math.floor(index / 4) * 2 + 1)
        //     );
        //   });
        // },
      },
    ],
    layoutOptions: { rowHeight: 50 },
    getDropNode: (node) => {
      const { width, height } = node.size();
      if (node.shape === "custom-node") {
        node.attr("text/fontSize", 10);
        node.attr("circle/r", 3);
        return node.clone();
      }
      return node.clone().size(width, height);
    },
  });
}

// 组件栏注册节点
export function registerNode(graph, stencil) {
  // 注册节点
  const transSite1 = graph.createNode({
    shape: "rect",
    width: 20,
    height: 60,
    label: "换乘站",
    attrs: {
      body: {
        rx: 8,
        ry: 12,
        strokeWidth: 1,
      },
      label: {
        text: "换乘站",
        fontSize: 12,
        "writing-mode": "vertical-rl",
        transform: "translate(-2, -5)",
      },
    },
    data: {
      name: "换乘站", // 边的名称
    },
  });
  const transSite2 = graph.createNode({
    shape: "rect",
    width: 70,
    height: 20,
    label: "换乘站",
    attrs: {
      body: {
        rx: 10,
        ry: 15,
        strokeWidth: 1,
      },
      label: {
        text: "换乘站",
        fontSize: 12,
      },
    },
    data: {
      name: "换乘站", // 边的名称
    },
  });
  const rect2 = graph.createNode({
    shape: "circle",
    width: 30,
    height: 30,
    label: "标记",
    x: 100,
    y: 100,
    attrs: {
      body: {
        rx: 10,
        ry: 20,
        strokeWidth: 1,
        fill: "#ffffff",
      },
    },
    data: {
      name: "标记", // 边的名称
    },
  });
  const rect3 = graph.createNode({
    shape: "t-node",
    width: 60,
    height: 40,
    label: "",
  });

  // 注册站点节点
  const texthr = graph.createNode({
    shape: "custom-node",
    width: 60,
    height: 30,
    label: "",
    attrs: {
      body: {
        strokeWidth: 1,
        strokeDasharray: 0,
        stroke: "rgba(255,255,255,0.1)",
        fill: "#fff",
      },
    },
  });

  const texthb = graph.createNode({
    shape: "custom-node",
    width: 60,
    height: 30,
    label: "",
    attrs: {
      circle: {
        r: 5,
        cx: 25,
        cy: 10,
      },
      text: {
        text: "站点",
        refX: 38,
        refY: 20,
        "text-anchor": "end",
      },
    },
  });

  const textht = graph.createNode({
    shape: "custom-node",
    width: 60,
    height: 30,
    label: "",
    attrs: {
      circle: {
        r: 5,
        cx: 25,
        cy: 30,
      },
      text: {
        text: "站点",
        refX: 10,
        refY: 9,
      },
    },
  });

  const texthl = graph.createNode({
    shape: "custom-node",
    width: 60,
    height: 30,
    label: "",
    attrs: {
      circle: {
        r: 5,
        cx: 50,
        cy: 16,
      },
      text: {
        text: "站点",
        refX: 40,
        refY: 9,
        "text-anchor": "end",
      },
    },
  });

  const textvb = graph.createNode({
    shape: "custom-node",
    width: 30,
    height: 60,
    label: "",
    x: 0,
    y: 0,
    attrs: {
      circle: {
        r: 5,
        cx: 10,
        cy: 10,
      },
      text: {
        text: "站点",
        refX: 10,
        refY: 10,
        "writing-mode": "vertical-rl",
      },
    },
  });
  const textvt = graph.createNode({
    shape: "custom-node",
    width: 30,
    height: 60,
    label: "",
    attrs: {
      body: {
        rx: 20,
        ry: 25,
      },
      circle: {
        r: 5,
        cx: 10,
        cy: 45,
      },
      text: {
        text: "站点",
        refX: 10,
        refY: 22,
        "text-anchor": "end",
        "writing-mode": "vertical-rl",
      },
    },
  });

  const textvl = graph.createNode({
    shape: "custom-node",
    width: 30,
    height: 60,
    label: "",
    attrs: {
      body: {
        rx: 20,
        ry: 25,
      },
      circle: {
        r: 5,
        cx: 20,
        cy: 22,
      },
      text: {
        text: "站点",
        refX: 0,
        refY: 22,
        "text-anchor": "end",
        "writing-mode": "vertical-rl",
      },
    },
  });
  const textvr = graph.createNode({
    shape: "custom-node",
    width: 30,
    height: 60,
    label: "",
    attrs: {
      body: {
        rx: 20,
        ry: 25,
      },
      circle: {
        r: 5,
        cx: 0,
        cy: 22,
      },
      text: {
        text: "站点",
        refX: 20,
        refY: 22,
        "text-anchor": "end",
        "writing-mode": "vertical-rl",
      },
    },
  });

  stencil.load([transSite1, transSite2, rect2, rect3], "标记");
  stencil.load(
    [texthr, texthl, texthb, textht, textvb, textvt, textvl, textvr],
    "站点"
  );
}

const initEdge = (pos) => {
  node = graph.addNode({
    shape: "circle",
    width: 10,
    height: 10,
    ...pos,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: "#5F95FF",
        fill: "#EFF4FF",
      },
    },
  });
  edge = graph.addEdge({
    source: node,
    target: pos,
    connector: {
      name: "rounded",
      args: {},
    },
    data: {
      name: "line", // 边的名称
    },
    attrs: {
      line: {
        targetMarker: null,
        stroke: "#5F95FF",
        strokeWidth: 2,
      },
    },
  });
};

const onMouseMove = (e) => {
  if (edge) {
    const pos = graph.clientToLocal(e.clientX, e.clientY);
    edge.setTarget(pos);
  }
};

const print = (graph) => {
  if (edge) {
    const view = graph.findViewByCell(edge);
    console.log(view.path.serialize());
  }
};
const finish = (closed, container) => {
  if (node && edge) {
    const vertices = edge.getVertices();
    if (closed) {
      if (vertices.length >= 2) {
        const center = node.getBBox().center;
        edge.setSource(center);
        edge.setTarget(center);
        graph.removeNode(node);
        node = null;
        print(graph);
      } else {
        graph.removeCells([node, edge]);
        node = null;
        edge = null;
      }
    } else {
      if (vertices.length >= 1) {
        const center = node.getBBox().center;
        edge.setSource(center);
        edge.setTarget(vertices[vertices.length - 1]);
        graph.removeNode(node);
        node = null;
        print(graph);
      } else {
        graph.removeCells([node, edge]);
        node = null;
        edge = null;
      }
    }
    container.removeEventListener("mousemove", onMouseMove);
  }
};
const addVertices = (pos) => {
  if (node && edge) {
    edge.appendVertex(pos);
  }
};

// 事件
export function eventOnFun(gra, container, callback) {
  graph = gra;

  // 空白处点击事件
  graph.on("blank:click", ({ x, y }) => {
    if (callback().isLink) {
      initEdge({ x, y });
      container.addEventListener("mousemove", onMouseMove);
    }
    callback({ blankClick: true });

    // 获取图中所有节点
    const nodes = graph.getNodes();
    // 遍历所有节点，移除删除按钮
    nodes.forEach((node) => {
      // 检查节点是否有删除按钮工具
      const tools = node.getTools();
      if (tools) {
        const hasRemoveButton = tools.items?.some(
          (tool) => tool.name === "button-remove"
        );

        if (hasRemoveButton) {
          // 移除删除按钮
          node.removeTool("button-remove");
        }
      }
    });
  });
  // 连线右键事件
  graph.on("edge:contextmenu", ({ x, y, edge }) => {
    if (callback().isLink) {
      finish(false, container);
    } else {
      console.log(x, y);
      // // 将画布坐标转换为客户端坐标
      // const clientPos = graph.localToClient(x, y);
      // const edgeView = graph.findViewByCell(edge);
      // const distance = edgeView.getClosestPointRatio({ x, y }); // 获取比例值
      // callback({
      //   contextmenu: true,
      //   edge: { ...edge, distance },
      //   pos: { x: clientPos.x, y: clientPos.y },
      // });
    }
    edge.attr("line/strokeDasharray", 5);
    edge.attr("line/style/animation", "ant-line 30s infinite linear");
  });
  // 连线点击事件
  graph.on("edge:click", ({ x, y, edge }) => {
    const nodes = graph.getNodesFromPoint(x, y);
    if (nodes.length && nodes[0] === node) {
      finish(true, container);
    } else {
      addVertices({ x, y });
    }
    callback({ edgeClick: true, edge });
  });

  // 节点点击事件
  graph.on("node:click", ({ node }) => {
    if (node.shape !== "car-node") {
      node.addTools([
        {
          name: "button-remove",
          args: { x: 0, y: 0, offset: { x: -10, y: -10 } },
        },
      ]);
    }
  });

  // 连线鼠标移入事件
  graph.on("edge:mouseenter", ({ cell }) => {
    if (!callback().isLink && callback().isEditEdge) {
      cell.addTools([
        { name: "vertices" },
        {
          name: "button-remove",
          args: { distance: 20 },
        },
        {
          name: "source-arrowhead",
          args: {
            tagName: "circle",
            attrs: { r: 6, cx: 6, fill: "#ffd591", stroke: "#ffa940" },
          },
        },
        {
          name: "target-arrowhead",
          args: {
            tagName: "circle",
            attrs: { r: 6, cx: 6, fill: "#ffd591", stroke: "#ffa940" },
          },
        },
      ]);
    }
  });

  // 连线鼠标移出事件
  graph.on("edge:mouseleave", ({ cell }) => {
    if (cell.hasTool("vertices")) {
      cell.removeTool("vertices");
    }
    if (cell.hasTool("button-remove")) {
      cell.removeTool("button-remove");
    }
    if (cell.hasTool("source-arrowhead")) {
      cell.removeTool("source-arrowhead");
    }
    if (cell.hasTool("target-arrowhead")) {
      cell.removeTool("target-arrowhead");
    }
  });

  //  节点右键点击事件
  graph.on("node:contextmenu", ({ x, y, node }) => {
    // 将画布坐标转换为客户端坐标
    const clientPos = graph.localToClient(x, y);

    callback({
      nodemenu: true,
      node,
      pos: { x: clientPos.x, y: clientPos.y },
    });
  });
}

// 清除事件
export function eventOffFun(graph) {
  graph.off("blank:click");
  graph.off("node:click");
  graph.off("edge:click");
  graph.off("edge:contextmenu");
  graph.off("edge:mouseenter");
  graph.off("edge:mouseleave");
  graph.off("node:contextmenu");
}

// 数据内容以及样式更新
// 设置边线样式
export function setEdge(form) {
  const edge = graph.getCellById(form.edgeId);
  // 也可以单独修改某个属性
  edge.setData({ ...edge.getData(), name: form.name }); // 仅修改文字
  edge.attr("line/stroke", form.color); // 仅修改边颜色
  edge.attr("line/strokeWidth", form.width); // 仅修改箭头填充色
}

// 设置标记点样式
export function setNode(form) {
  const node = graph.getCellById(form.nodeId);
  // 也可以单独修改某个属性
  node.setData({ ...node.getData(), name: form.text }); // 仅修改文字
  node.attr("label/text", form.text); // 修改显示文字
  node.attr("body/fill", form.fill); // 修改填充颜色
  node.attr("body/stroke", form.borderColor); // 修改填充颜色
  node.attr("body/strokeWidth", form.border); // 修改填充颜色
  node.attr("label/fill", form.color); // 修改文字颜色
  node.attr("label/fontSize", form.fontSize); // 修改文字大小
  node.resize(Number(form.width), Number(form.height));
  node.attr(
    "text/style/writing-mode",
    form.type === "2" ? "vertical-rl" : "horizontal-tb"
  ); // 修改文字偏移量
  node.position(Number(form.pointPos.x), Number(form.pointPos.y));
  graph.resetSelection(node);
}

// 设置自定义节点样式
export function setCustomNode(form) {
  const node = graph.getCellById(form.nodeId);
  node.attr("text/text", form.text); // 修改文字
  node.attr("label/text", form.text); // 修改文字
  node.attr("text/refX", form.textPos.x); // 修改文字偏移量
  node.attr("text/refY", form.textPos.y); // 修改文字偏移量
  node.attr("text/fontSize", form.fontSize); // 修改文字偏移量
  node.attr("circle/cx", form.pointPos.x); // 修改点位偏移量
  node.attr("circle/cy", form.pointPos.y); // 修改点位偏移量
  node.attr("circle/r", form.size); // 修改点大小
  node.attr(
    "text/style/writing-mode",
    form.type === "2" ? "vertical-rl" : "horizontal-tb"
  ); // 修改文字偏移量
}

// 撤销
export function onUndo() {
  graph.undo();
}

// 重做
export function onRedo() {
  graph.redo();
}

// 轨迹
export function trajectory(sites) {
  graph.addNode({
    id: "car-node",
    x: 0,
    y: 0,
    shape: "car-node",
    attrs: {
      body: {
        visibility: "hidden",
      },
      image: {
        visibility: "hidden",
      },
    },
  });
  let n = 0;
  let x = 0;
  let y = 0;
  const nodes = graph.getNodes();
  const siteNodes = nodes.filter((item) =>
    sites.includes(item.attr("label/text"))
  );
  let timer = setInterval(() => {
    n = n + 1;
    if (n > siteNodes.length - 1) {
      clearInterval(timer);
      return;
    }
    const node = siteNodes.find((site) => site.attr("label/text") === sites[n]);
    const carNode = graph.getCellById("car-node");
    const image = carNode.attr("body");
    if (!node) return;
    if (node.shape === "custom-node") {
      const circle = node.attr("circle");
      // 计算站点坐标
      x = node.position().x + Number(circle.cx);
      y = node.position().y + Number(circle.cy) - image.r - 2 * circle.r;
    } else {
      // const rect = node.attr("body");
      // console.log(circle, carNode);
      // 计算站点坐标
      x = node.position().x + node.size().width / 2;
      y = node.position().y;
    }
    if (x && y) {
      carNode.position(x, y);
      isViewInner(carNode);
      carNode.attr("body/visibility", true);
      carNode.attr("image/visibility", true);
    }
  }, 1000);
}

// 判断节点是否在可视区域内，如果不在，移动画布，使之出现
function isViewInner(node, padding = 50) {
  // 获取画布容器尺寸
  const container = graph.container;
  const viewWidth = container.clientWidth;
  const viewHeight = container.clientHeight;

  // 获取当前变换状态
  const zoom = graph.zoom();
  const { tx, ty } = graph.translate();

  // 获取节点边界
  const bbox = node.getBBox();
  const nodeLeft = bbox.x;
  const nodeRight = bbox.x + bbox.width;
  const nodeTop = bbox.y;
  const nodeBottom = bbox.y + bbox.height;

  // 计算当前可视区域边界（考虑缩放）
  const viewLeft = -tx / zoom;
  const viewRight = (-tx + viewWidth) / zoom;
  const viewTop = -ty / zoom;
  const viewBottom = (-ty + viewHeight) / zoom;

  // 添加缓冲区域
  const paddedViewLeft = viewLeft + padding / zoom;
  const paddedViewRight = viewRight - padding / zoom;
  const paddedViewTop = viewTop + padding / zoom;
  const paddedViewBottom = viewBottom - padding / zoom;

  // 计算需要的平移量（初始为0）
  let offsetX = 0;
  let offsetY = 0;

  // 检查左边界
  if (nodeLeft < paddedViewLeft) {
    offsetX = nodeLeft - paddedViewLeft;
  }
  // 检查右边界
  else if (nodeRight > paddedViewRight) {
    offsetX = nodeRight - paddedViewRight;
  }

  // 检查上边界
  if (nodeTop < paddedViewTop) {
    offsetY = nodeTop - paddedViewTop;
  }
  // 检查下边界
  else if (nodeBottom > paddedViewBottom) {
    offsetY = nodeBottom - paddedViewBottom;
  }

  // 如果有需要移动的偏移量
  if (offsetX !== 0 || offsetY !== 0) {
    // 计算新的平移位置
    const newPanX = tx - offsetX * zoom;
    const newPanY = ty - offsetY * zoom;

    // 应用新的平移位置
    graph.translate(newPanX, newPanY, {
      animation: {
        duration: 300,
        easing: "easeInOutCubic",
      },
    });
  }
}

// 我们用 insert-css 协助demo演示
// 实际项目中只要将下面样式添加到样式文件中
// 我们用 insert-css 演示引入自定义样式
// 推荐将样式添加到自己的样式文件中
// 若拷贝官方代码，别忘了 npm install insert-css
insertCss(`
  @keyframes ant-line {
    to {
        stroke-dashoffset: -1000
    }
  }
`);
