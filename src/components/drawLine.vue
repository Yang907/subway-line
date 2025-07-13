<template>
  <div class="container" style="width: 100vw; height: 100vh">
    <div class="content" style="width: 100%; height: 100%">
      <div v-show="!onlyRead" id="stencilContainer"></div>
      <div id="graphContainer"></div>
    </div>
    <!-- 工具栏 -->
    <div class="operations" v-show="!onlyRead">
      <div class="operations-item" @click="handleView()">
        <div class="text"><i class="el-icon-view"></i>只读模式</div>
      </div>
      <div class="operations-item" @click="handleShowSetAll()">
        <div class="text"><i class="el-icon-setting"></i>批量配置</div>
      </div>
      <div
        class="operations-item"
        :class="{ active: isEditEdge }"
        @click="handleEdge()"
      >
        <div class="text"><i class="el-icon-edit"></i>编辑连线</div>
      </div>
      <div
        class="operations-item"
        :class="{ active: isLink }"
        @click="handleLink()"
      >
        <div class="text">
          <i class="el-icon-thumb"></i>{{ isLink ? "关闭连线" : "开启连线" }}
        </div>
      </div>
      <div class="operations-item" @click="handleUndo()">
        <div class="text"><i class="el-icon-back"></i>回退</div>
      </div>
      <div class="operations-item" @click="handleRedo()">
        <div class="text"><i class="el-icon-right"></i>前进</div>
      </div>
      <div class="operations-item" @click="handleSave()">
        <div class="text"><i class="el-icon-document-remove"></i>保存</div>
      </div>
    </div>
    <!-- 连线弹窗 -->
    <el-drawer title="线路信息" :visible.sync="drawer">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="线宽">
          <el-input v-model="form.width"></el-input>
        </el-form-item>
        <el-form-item label="颜色">
          <div style="display: flex">
            <el-input v-model="form.color"></el-input>
            <el-color-picker v-model="form.color"></el-color-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-dialog :visible.sync="dialogVisible" title="批量配置" width="500">
      <el-form ref="form" :model="formAll" label-width="80px">
        <el-form-item label="字体大小">
          <el-input v-model="formAll.fontSize"></el-input>
        </el-form-item>
        <el-form-item label="文字颜色">
          <el-input v-model="formAll.color"></el-input>
        </el-form-item>
        <el-form-item label="线路宽度">
          <el-input v-model="formAll.lineWidth"></el-input>
        </el-form-item>
        <el-form-item label="站点大小">
          <el-input v-model="formAll.siteSize"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSetAll"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 右键节点下拉菜单 -->
    <div class="custom_drop_down" id="custom_drop_down">
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          背景色：
          <el-input v-model="nodeForm.fill" size="mini"></el-input>
          <el-color-picker
            v-model="nodeForm.fill"
            size="mini"
          ></el-color-picker>
        </div>
      </div>
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          字颜色：
          <el-input v-model="nodeForm.color" size="mini"></el-input>
          <el-color-picker
            v-model="nodeForm.color"
            size="mini"
          ></el-color-picker>
        </div>
      </div>
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          边框线：
          <el-input
            v-model="nodeForm.border"
            size="mini"
            placeholder="粗细"
          ></el-input>
          <el-color-picker
            v-model="nodeForm.borderColor"
            size="mini"
          ></el-color-picker>
        </div>
      </div>
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          文本：
          <el-input
            v-model="nodeForm.text"
            size="mini"
            placeholder="内容"
          ></el-input>
          <el-input
            v-model="nodeForm.fontSize"
            size="mini"
            placeholder="大小"
          ></el-input>
        </div>
      </div>
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          <span>大小：</span>
          <el-input
            v-model="nodeForm.width"
            size="mini"
            placeholder="宽"
          ></el-input>
          <el-input
            v-model="nodeForm.height"
            size="mini"
            placeholder="高"
          ></el-input>
        </div>
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          white-space: nowrap;
          font-size: 12px;
        "
      >
        点偏移：x：<el-input
          v-model="nodeForm.pointPos.x"
          size="mini"
        ></el-input>
        y：<el-input v-model="nodeForm.pointPos.y" size="mini"></el-input>
      </div>
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          排列方式：
          <el-radio v-model="nodeForm.type" label="1">横向</el-radio>
          <el-radio v-model="nodeForm.type" label="2">竖向</el-radio>
        </div>
      </div>
      <div
        class="custom_drop_down_item"
        style="display: flex; justify-content: center"
      >
        <el-button size="mini" type="primary" @click="handleSetNode"
          >确定</el-button
        >
        <el-button size="mini" @click="handleCancelMenu('custom_node_menu')"
          >取消</el-button
        >
      </div>
    </div>
    <!-- 右键站点下拉菜单 -->
    <div class="custom_drop_down" id="custom_site_menu">
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          站点名称：
          <el-input v-model="siteForm.text" size="mini"></el-input>
        </div>
      </div>
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          点位偏移：x：<el-input
            v-model="siteForm.pointPos.x"
            size="mini"
          ></el-input>
          y：<el-input v-model="siteForm.pointPos.y" size="mini"></el-input>
        </div>
      </div>
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          文字偏移：x：<el-input
            v-model="siteForm.textPos.x"
            size="mini"
          ></el-input>
          y：<el-input v-model="siteForm.textPos.y" size="mini"></el-input>
        </div>
      </div>
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          排列方式：
          <el-radio v-model="siteForm.type" label="1">横向</el-radio>
          <el-radio v-model="siteForm.type" label="2">竖向</el-radio>
        </div>
      </div>
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          字体大小：
          <el-input v-model="siteForm.fontSize" size="mini"></el-input>
        </div>
      </div>
      <div class="custom_drop_down_item">
        <div
          style="
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
          "
        >
          站点大小：
          <el-input v-model="siteForm.size" size="mini"></el-input>
        </div>
      </div>
      <div
        class="custom_drop_down_item"
        style="display: flex; justify-content: center"
      >
        <el-button size="mini" type="primary" @click="handleSetSite"
          >确定</el-button
        >
        <el-button size="mini" @click="handleCancelMenu('custom_site_menu')"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import {
  initGraph,
  initStencil,
  registerNode,
  eventOnFun,
  setEdge,
  setNode,
  initPlugIns,
  setCustomNode,
  onUndo,
  onRedo,
  eventOffFun,
  trajectory,
} from "./utils";
import { data } from "./data/lineData";
import { subwayLines } from "./data/data";

export default {
  name: "drawLine",
  data() {
    return {
      graph: null,
      stencil: null,
      container: null,
      onlyRead: false,
      isSelect: false,
      isShowEditCard: false,
      isLink: false,
      drawer: false,
      isEditEdge: false,
      curEdge: null,
      posEdge: null,
      dialogVisible: false,
      // 线路配置表单
      form: {
        name: "",
        width: 1,
        color: "#000",
        edgeId: "",
      },
      // 节点表单
      nodeForm: {
        fill: "#000",
        text: "",
        nodeId: "",
        width: 0,
        height: 0,
        color: "#000",
        fontSize: 12,
        border: 1,
        borderColor: "#000",
        type: "1",
        pointPos: {
          // 点位偏移量
          x: 0,
          y: 0,
        },
      },
      // 站点表单
      siteForm: {
        text: "",
        pointPos: {
          // 点位偏移量
          x: 0,
          y: 0,
        },
        textPos: {
          // 文字偏移量
          x: 0,
          y: 0,
        },
        type: "1", // 文字排列方式
        fontSize: 10,
        size: 10,
      },
      // 批量配置信息
      formAll: {
        fontSize: "",
        color: "",
        lineWidth: "",
        siteSize: "",
      },
    };
  },
  mounted() {
    this.init();
    const graphData = JSON.parse(window.localStorage.getItem("graphData"));
    console.log(graphData);
    if (graphData) {
      this.graph.fromJSON(graphData);
    } else {
      this.graph.fromJSON(data);
    }
    // 设置轨迹
    const sites = subwayLines
      .find((item) => item.line === 4)
      .upSite.via_stops.map((item) => item.name);
    trajectory(sites);
  },
  methods: {
    init() {
      // 创建画布
      this.graph = initGraph("graphContainer");
      // 配置插件
      initPlugIns(this.graph);
      // 创建左侧组件栏
      this.stencil = initStencil(this.graph);
      this.container = document.getElementById("graphContainer");
      document
        .getElementById("stencilContainer")
        .appendChild(this.stencil.container);
      // 注册节点
      registerNode(this.graph, this.stencil);
      // 启用事件交互监听
      this.interactiveFun();
    },

    // 启动所有交互效果
    interactiveFun() {
      eventOnFun(this.graph, this.container, (linkData) => {
        // 点击线段弹出线段信息进行修改
        if (linkData && linkData.edgeClick && !this.isLink) {
          this.drawer = true;
          this.form.color = linkData.edge.attr("line/stroke");
          this.form.width = linkData.edge.attr("line/strokeWidth");
          this.form.edgeId = linkData.edge.id;
          this.form.name = linkData.edge.getData().name;
        } else {
          this.drawer = false;
        }
        // 右键显示连线菜单
        if (linkData && linkData.contextmenu) {
          this.curEdge = linkData.edge;
          this.posEdge = linkData.pos;
          this.handleMenuShow(
            linkData.pos.x,
            linkData.pos.y,
            "custom_drop_down",
            "block"
          ); // 调用自定义的右键菜单显示方法
        }
        // 右键显示节点菜单
        if (
          linkData &&
          linkData.nodemenu &&
          linkData.node.shape !== "custom-node"
        ) {
          this.posEdge = linkData.pos;
          this.nodeForm.fill = linkData.node.attr("body/fill");
          this.nodeForm.border = linkData.node.attr("body/strokeWidth");
          this.nodeForm.borderColor = linkData.node.attr("body/stroke");
          this.nodeForm.color = linkData.node.attr("label/fill");
          this.nodeForm.fontSize = linkData.node.attr("label/fontSize");
          this.nodeForm.nodeId = linkData.node.id;
          this.nodeForm.width = linkData.node.size().width;
          this.nodeForm.height = linkData.node.size().height;
          this.nodeForm.pointPos.x = linkData.node.position().x;
          this.nodeForm.pointPos.y = linkData.node.position().y;
          // this.nodeForm.text = linkData.node.getData().name;
          this.nodeForm.text = linkData.node.attr("label/text");

          this.handleMenuShow(
            linkData.pos.x,
            linkData.pos.y,
            "custom_node_menu",
            "block"
          );
        }
        // 右键显示站点配置菜单
        if (
          linkData &&
          linkData.nodemenu &&
          linkData.node.shape === "custom-node"
        ) {
          this.posEdge = linkData.pos;
          this.siteForm.nodeId = linkData.node.id;
          this.siteForm.pointPos.x = linkData.node.getAttrs().circle.cx;
          this.siteForm.pointPos.y = linkData.node.getAttrs().circle.cy;
          this.siteForm.size = linkData.node.getAttrs().circle.r;
          this.siteForm.textPos.x = linkData.node.getAttrs().text.refX;
          this.siteForm.textPos.y = linkData.node.getAttrs().text.refY;
          this.siteForm.text = linkData.node.getAttrs().text.text;
          this.siteForm.fontSize = linkData.node.getAttrs().text.fontSize;
          this.handleMenuShow(
            linkData.pos.x,
            linkData.pos.y,
            "custom_site_menu",
            "block"
          );
        }
        // 点击空白处取消菜单
        if (linkData && linkData.blankClick) {
          this.handleCancelMenu("custom_drop_down");
          this.handleCancelMenu("custom_node_menu");
          this.handleCancelMenu("custom_site_menu");
        }
        return { isLink: this.isLink, isEditEdge: this.isEditEdge };
      });
    },

    handleLink() {
      this.isLink = !this.isLink;
      if (this.isEditEdge) {
        this.isEditEdge = false;
      }
    },
    handleEdge() {
      this.isEditEdge = !this.isEditEdge;
      if (this.isLink) {
        this.isLink = false;
      }
    },
    onSubmit() {
      this.drawer = false;
      setEdge(this.form);
    },

    handleSetNode() {
      setNode(this.nodeForm);
      this.handleCancelMenu("custom_node_menu");
    },
    handleSetSite() {
      setCustomNode(this.siteForm);
      this.handleCancelMenu("custom_site_menu");
    },

    handleShowSetAll() {
      this.dialogVisible = true;
    },
    // 批量设置
    handleSetAll() {
      const nodes = this.graph.getNodes();
      nodes.forEach((item) => {
        if (this.formAll.fontSize) {
          item.attr("label/fontSize", Number(this.formAll.fontSize));
          item.attr("text/fontSize", Number(this.formAll.fontSize));
        }
        if (this.formAll.color) {
          item.attr("label/fill", this.formAll.color);
          item.attr("text/fill", this.formAll.color);
        }
        if (this.formAll.siteSize) {
          item.attr("circle/r", Number(this.formAll.siteSize));
        }
      });
      if (this.formAll.lineWidth) {
        const lines = this.graph.getEdges();
        lines.forEach((item) => {
          item.attr("line/strokeWidth", Number(this.formAll.lineWidth));
        });
      }
      this.dialogVisible = false;
    },

    handleMenuShow(x, y, name) {
      this.$nextTick(() => {
        this.show(x, y, this.graph, name);
      });
    },

    handleCancelMenu(name) {
      const dropdown = document.getElementById(name);
      if (dropdown) {
        dropdown.style.display = `none`;
      }
    },

    handleSave() {
      window.localStorage.setItem(
        "graphData",
        JSON.stringify(this.graph.toJSON())
      );
      console.log(this.graph.getNodes());
      this.$message({
        message: "保存成功",
        type: "success",
      });
    },

    handleUndo() {
      onUndo();
    },
    handleRedo() {
      onRedo();
    },
    handleView() {
      this.onlyRead = true;
      this.handleCancelMenu("custom_drop_down");
      this.handleCancelMenu("custom_node_menu");
      this.handleCancelMenu("custom_site_menu");
      this.graph.getEdges().forEach((edge) => {
        edge.removeTools();
      });
      this.graph.getNodes().forEach((node) => {
        node.prop("onlyRead", true);
        node.removeTools();
      });
      eventOffFun(this.graph);
      if (this.graph) {
        this.graph.options.interacting = false;
        this.graph.disableSelection();
      }
    },

    // 控制右键菜单显示位置
    show(x, y, graph, name) {
      const dropdown = document.getElementById(name);
      // 获取菜单尺寸（假设菜单宽200px，高根据项目数动态变化）
      dropdown.style.display = "block";
      const menuWidth = dropdown.offsetWidth;
      const menuHeight = dropdown.offsetHeight; // 每个菜单项36px高

      // 获取画布视口信息
      const clientWidth = graph.container.clientWidth;
      const clientHeight = graph.container.clientHeight;

      // 计算可视区域边界
      const viewportRight = clientWidth;
      const viewportBottom = clientHeight;

      // 智能调整位置（确保菜单在可视区域内）
      const adjustedX = x + menuWidth > viewportRight ? x - menuWidth : x;
      const adjustedY = y + menuHeight > viewportBottom ? y - menuHeight : y;

      dropdown.style.left = `${adjustedX}px`;
      dropdown.style.top = `${adjustedY}px`;
    },
  },
};
</script>
<style scoped>
.container {
  position: relative;
}
.content {
  font-family: sans-serif;
  display: flex;
}
#stencilContainer {
  width: 200px;
  border: 1px solid #f0f0f0;
  position: relative;
}

#graphContainer {
  flex: 1;
  height: 100%;
  box-shadow: 0 0 10px 1px #e9e9e9;
  display: flex;
}
.operations {
  /* border-radius: 8px; */
  background-color: #fff;
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  font-size: 14px;
}
.operations-item {
  cursor: pointer;
  padding: 5px 10px;
}
.operations-item .text {
  font-size: 12px;
}
.active {
  background-color: #409eff;
  color: #fff;
}
.custom_drop_down {
  width: 250px;
  border-radius: 4px;
  background-color: #fff;
  position: absolute;
  display: none;
  padding: 0 5px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.custom_drop_down .custom_drop_down_item {
  padding: 8px;
  cursor: pointer;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
.custom_drop_down .custom_drop_down_item .el-input-number {
  width: 100px;
}
.el-form {
  padding-right: 20px;
}
</style>
