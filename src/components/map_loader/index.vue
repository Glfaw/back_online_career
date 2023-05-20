<template>
  <div id="map_loader"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import {LoadingWrapper, ShowMsg} from '@/utils/common'

window._AMapSecurityConfig = {
  securityJsCode: '06fb6a35010eebfd1bfda625f3feedd0',
}

export default {
  name: "MapLoader",
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
  },
  data() {
    return {
      map: null,
      mapPlugin: [
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.HawkEye',
        'AMap.MapType',
        'AMap.Geolocation',
        'AMap.AutoComplete',
        'AMap.PlaceSearch'
      ],
      auto: null,
      autoOptions: {
        input: ''
      },
      searchLabel: '',
      placeSearch: null,
      district: null,
      polygons: []
    }
  },
  watch: {
    searchLabel(newVal) {
      if (newVal != null) {
        this.placeSearch.search(newVal)
        this.map.setZoom(16, true, 1)
        this.drawBounds(newVal)
      }
    }
  },
  created() {
    this.$bus.$on('AutoComplete', val => {
      this.autoOptions.input = val.input
      this.searchLabel = val.label
    })
  },
  mounted() {
    this.setSize()
    this.initMap()
  },
  beforeDestroy() {
    this.$bus.$off(['AutoComplete'])
  },
  methods: {
    setSize() {
      const dom = this.$el
      dom.style.width = this.width
      dom.style.height = this.height
    },
    // 选中提示，更新地图
    selectTip(cur) {
      this.placeSearch.setCity(cur.poi.adcode)
      this.placeSearch.search(cur.poi.name)
      this.map.setZoom(10, true)
    },
    initMap() {
      const load = LoadingWrapper({
        text: '地图加载中',
        target: this.$el,
      })

      AMapLoader.load({
        key: '911f85297f8ff18601ab0fd0de5cf72b',
        version: '2.0',
        plugins: this.mapPlugin,
      }).then(AMap => {
        this.map = new AMap.Map('map_loader', {
          viewMode: '3D',
          zoom: 10,
          center:[105.602725,37.076636],
        })

        // 加载插件
        this.map.addControl(new AMap.Scale())
        this.map.addControl(new AMap.ToolBar())
        this.map.addControl(new AMap.HawkEye())
        this.map.addControl(new AMap.MapType())
        this.map.addControl(new AMap.Geolocation())

        this.auto = new AMap.AutoComplete(this.autoOptions)
        this.auto.on('select', this.selectTip)
        this.placeSearch = new AMap.PlaceSearch({
          map: this.map
        })

      }).catch(e => ShowMsg(e)).finally(() => {
        setTimeout(() => load.close(), 600)
      })
    },
    drawBounds(val) {
      if (!this.district) {
        let opt = {
          subdistrict: 0,
          extensions: 'all',
          level: 'district'
        }

        this.map.plugin(['AMap.DistrictSearch'], () => {
          this.district = new AMap.DistrictSearch(opt)
        })
      }

      this.district.search(val, (status, res) => {
        if (this.polygons != null) {
          this.map.remove(this.polygons)
          this.polygons = []
        }

        let bounds = res.districtList?.[0].boundaries
        if (bounds) {
          for (var i = 0, l = bounds.length; i < l; i++ ) {
            var polygon = new AMap.Polygon({
              strokeWeight: 1,
              path: bounds[0],
              fillOpacity: .4,
              fillColor: '#80d8ff',
              strokeColor: '#0091ea'
            })
            this.polygons.push(polygon)
          }
        }

        this.map.add(this.polygons)
        this.map.setFitView(this.polygons)
      })
    }
  }
}
</script>

<style lang="less" scoped>
#map_container {
  min-width: 100px;
  min-height: 100px;

  #container {
    width: 100%;
    height: 100%;
  }
}
</style>