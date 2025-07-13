<template>
  <div class="map-container">
    <div id="map" class="map-home"></div>
    <div id="info-card" class="info-card">
      <p>站点：</p>
    </div>
  </div>
</template>
<script>
import Map from "ol/Map";
import View from "ol/View";
import * as olProj from "ol/proj";
import Feature from "ol/Feature";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"; // 瓦片渲染方法
import { XYZ } from "ol/source"; // 瓦片资源
import { Vector as VectorSource } from "ol/source";
import { Style, Stroke, Fill, Circle } from "ol/style";
import { LineString, Point } from "ol/geom";
import { subwayLines } from "./data/data";
import { fromLonLat } from "ol/proj";
import Overlay from "ol/Overlay.js";

export default {
  name: "map-home",
  data() {
    return {
      openMap: null,
      pointLayer: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.openMap = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}", // 高德瓦片资源-普通地图
            }),
            opacity: 0.5,
          }),
        ],
        view: new View({
          center: olProj.fromLonLat([104.07, 30.6]),
          zoom: 12, // 缩放级别
        }),
      });

      const geometry = subwayLines.map((item) => {
        return {
          line: item.line,
          lineColor: item.lineColor,
          coords: item.upSite.path.map((item) => [item.lng, item.lat]),
        };
      });
      geometry.forEach((geo) => {
        this.drawLine(geo.coords, geo.lineColor);
      });

      const points = subwayLines.reduce(
        (pre, cur) => [...pre, ...cur.upSite.via_stops.map((item) => item)],
        []
      );
      this.drawPoint(points);

      // 4. 监听缩放事件并控制图层可见性
      this.openMap.on("moveend", () => {
        const currentZoom = this.openMap.getView().getZoom();
        if (currentZoom <= 11) {
          this.pointLayer.setVisible(false); // 缩放级别较大时隐藏
        } else {
          this.pointLayer.setVisible(true); // 缩放级别较小时显示
        }
      });
      // 添加点击事件
      const el = document.getElementById("info-card");
      var overlay = new Overlay({
        element: el,
        autoPan: true,
        positioning: "bottom-center",
      });
      this.openMap.on("click", (e) => {
        console.log(e);
        const feature = this.openMap.forEachFeatureAtPixel(
          e.pixel,
          (feature) => feature
        );
        if (feature) {
          var attribute = feature.values_.attribute;
          if (attribute && attribute.type === "站点") {
            el.style.display = "block";
            el.innerHTML = `<p>站点：${attribute.name}</p>`;
            overlay.setPosition(e.coordinate);
            this.openMap.addOverlay(overlay);
          } else {
            el.style.display = "none";
          }
        } else {
          el.style.display = "none";
        }
      });
    },
    //轨迹线  把每个点连起来
    drawLine(geometry, color) {
      // 3. 创建路径图层
      const pathLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          stroke: new Stroke({
            color: color, // 红色路径
            width: 4,
          }),
        }),
      });
      this.openMap.addLayer(pathLayer);

      const lineCoords = geometry.map((point) => fromLonLat(point));
      // 创建线要素
      const lineFeature = new Feature({
        geometry: new LineString(lineCoords),
      });

      // 添加线要素到图层
      pathLayer.getSource().addFeature(lineFeature);
    },

    // 画站点
    drawPoint(points) {
      // 3. 创建点图层
      this.pointLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          image: new Circle({
            radius: 3,
            fill: new Fill({
              color: "#fff",
            }),
            stroke: new Stroke({
              color: "#000",
              width: 1,
            }),
          }),
        }),
      });
      this.openMap.addLayer(this.pointLayer);
      const lineCoords = points.map((point) => {
        return {
          name: point.name,
          coords: fromLonLat([point.location.lng, point.location.lat]),
        };
      });
      // 创建线要素
      const pointFeatures = lineCoords.map((item) => {
        return new Feature({
          geometry: new Point(item.coords),
          attribute: {
            name: item.name,
            type: "站点",
          },
        });
      });

      // 添加线要素到图层
      this.pointLayer.getSource().addFeatures(pointFeatures);
    },
  },
};
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
}
.map-home {
  width: 100%;
  height: 100%;
}
.info-card {
  width: 200px;
  padding: 8px;
  background-color: #fff;
  border-radius: 8px;
  /* position: absolute; */
  display: none;
}
</style>
