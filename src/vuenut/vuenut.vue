<template lang="html">
  <div
  ref="convuenut"
  :style="{'font-size':fontSize+'px'}"
  class="contiene-vuenut"
  :class="{
    'resizex':resize,
    'unseen':unseen,
    'visiblex':visible
    }">
    <circle-buttom
     :hidden="hiddenx"
     :sticky="sticky"
     :unseen="unseen"
     :resize="resize"
     :visible="visible"
     @click="clickCircle"/>

  <div

    class="con-vuenut">

    <locked v-if="password!=passwordx" v-model="passwordx"/>

    <div v-else class="con-funcionalidad">


    <menu-circles
    @font-size-plus="fontSize+=4"
    @font-size-less="fontSize-=4"
    :fontSize="fontSize"
    :jsonSpace="jsonSpace"
    @sticky-click="cambiarSticky"
    :sticky="sticky"
      :password="password"
      @click-locked="passwordx=''"
      @change-import="changeImport"
      :storex="store"
      @click-resize="resize=!resize"
      :resize="resize"
      @click-copiar="copiedx"
      :formato="formato"
     @click-formato="formatox"/>

    <div class="arbolJson">
      <jsonview v-if="formato=='arbol'" @copied-click="copiedx" :json.sync="storeVuenut"></jsonview>
      <div v-show="formato=='json'" class="con-prejson">
          <pre >
            <code v-html="storeVuenut" ref="codex" class="json">
            </code>
          </pre>
      </div>
      <div v-show="formato=='edit'" class="store-edit">
        <ul>
          <li class="li-cancel" title="Cancelar" @click="formato='arbol'">
            <i class="material-icons">clear</i>
          </li>
          <li title="ofuscar" @click="ofuscarx">
            <i class="material-icons">vertical_align_center</i>
          </li>
          <li title="Formatear" @click="formatearText">
            <i class="material-icons">format_line_spacing</i>
          </li>
          <li class="guardar-li" title="Guardar" @click="guardarEdit">
            <i class="material-icons">save</i>
          </li>
        </ul>
        <textarea spellcheck="false" ref="textareax" :value="JSON.stringify(storeVuenut,null,2)" name="name"></textarea>
      </div>
    </div>



    <transition name="fade-noti">
    <div v-if="copiado" class="noti">
      <i class="material-icons">beenhere</i> {{texto}}
    </div>
    <div v-if="eliminado" class="noti n-eliminar">
      <i class="material-icons">report</i> {{textoEliminado}}
    </div>
  </transition>
  </div>
  </div>
  <a ref="screenshot" id="screenshot"></a>
</div>
</template>

<script>
var hljs = require('highlight.js');
import circleButtom from './circleButtom.vue'
import menuCircles from './menuCircles.vue'
import jsonview from './jsonview.vue'
import locked from './locked.vue'
import html2canvas from 'html2canvas';
// require('assets/iconfont/material-icons.css');
// import Image from 'assets/vuenut.png'

export default {
  name:'vuenut',
  props:{
    hidden:{
      type:Boolean,
      default:false,
    },
    unseen:{
      type:Boolean,
      default:false,
    },
    password:{
      type:[String,Boolean],
      default:false,
    },
    store:{
      type:Object,
      default:false,
    }
  },
  components:{
    jsonview,
    circleButtom,
    menuCircles,
    locked
  },
  data(){
    return {
      // imgx:Image,
      hiddenx:this.hidden,
      map:{},
      baseUrl: process.env.BASE_URL,
      storeVuenut:this.store,
      fontSize:16,
      jsonSpace:2,
      sticky:true,
      passwordx:'',
      eliminado:false,
      resize:false,
      textoEliminado:'Store Eliminado',
      texto:'Store Copiado',
      formato:'arbol',
      copiado:false,
      visible:false,
    }
  },
  watch:{
    storeVuenut(){
      console.log('cambio');
    },
    store(){
      console.log("paso por aqui");
      this.storeVuenut = this.store
      console.dir(this.store);
      setTimeout( ()=> {
        // [object Object]
        hljs.highlightBlock(this.$refs.codex);
      }, 300);
    },
    fontSize(){
      console.log("cambio size");
      if(this.fontSize<29&&this.fontSize>11){
        localStorage.setItem("vuenutFontSize", this.fontSize);

      }
    }
  },
  created(){
    if(localStorage.hasOwnProperty('vuenutSticky')){

      this.sticky = (localStorage.getItem('vuenutSticky') == 'true');
    }
    if(localStorage.hasOwnProperty('vuenutFontSize')){

      this.fontSize = Number(localStorage.getItem("vuenutFontSize"));
    }

  },
  mounted(){
    console.log(document.querySelector('code'));
    hljs.highlightBlock(this.$refs.codex);
    // .each(function(i, block) {
    // });
    if(this.hidden){
      document.addEventListener("keyup",this.keyx)
      document.addEventListener("keydown",this.keyx)
    }

    document.addEventListener("keyup",this.capturex)
    document.addEventListener("keydown",this.capturex)
  },
  filters: {
    json: (value) => { return JSON.stringify(value, null, 2) }
  },
  methods:{
    capturex(){
      let _this = this
      let keyx = "p"

    this.map[event.key] = event.type == 'keydown';
        if(this.map["Alt"] && this.map[keyx]){
          html2canvas(document.body).then(function(canvas) {
            var link = _this.$refs.screenshot;
            var image = canvas.toDataURL();
            if(!link.href){
              link.href = image;
            }
            link.download = 'vuenut-screenshot.png';
            link.click()
          });
        }
    },
    keyx(){
      let keyx = "h"
    this.map[event.key] = event.type == 'keydown';
        if(this.map["Alt"] && this.map[keyx]){
          this.hiddenx = !this.hiddenx
        }
    },
    ofuscarx(){
      let textareax = this.$refs.textareax
      let valuex = JSON.stringify(JSON.parse(textareax.value),null,0)
      textareax.value = valuex
    },
    formatearText(){
      let textareax = this.$refs.textareax
      let valuex = JSON.stringify(JSON.parse(textareax.value),null,2)
      textareax.value = valuex
    },
    guardarEdit(){
      let textareax = this.$refs.textareax
      // textareax = textareax.value.replace(/\s/g,"");
      textareax = textareax.value
      console.log("guardar",textareax);
      let parsex = false
      try {
        parsex = JSON.parse(textareax);
      } catch(e) {
        // console.log("error",e); // error in the above string (in this case, yes)!
      }
  if(parsex){
    this.$store.replaceState(JSON.parse(textareax))
    // this.formato='arbol'
    this.texto = 'Store guardardo'
    this.copiado = true
    setTimeout( () => {
      this.copiado = false
    }, 1500);
    hljs.highlightBlock(this.$refs.codex)
  } else {
    this.textoEliminado = "No es un JSON válido"
    this.eliminado = true
    setTimeout( () => {
      this.eliminado = false
    }, 1500);
  }
      ;
    },
    formatox(value){
      this.formato = value
    },
    cambiarSticky(){
      this.sticky =! this.sticky
      console.log("paso",this.sticky);
      localStorage.setItem("vuenutSticky", this.sticky);
    },
    changeImport(valido,archivo='.json',texto="Store importado"){
      if(valido){
        this.texto = texto
        this.copiado = true
        setTimeout( () => {
          this.copiado = false
        }, 2000);
      } else {

        this.textoEliminado = `Solo se permiten archivos (${archivo})`
        this.eliminado = true
        setTimeout( () => {
          this.eliminado = false
        }, 2000);
      }
    },
    copiedx(texto,copiar){
      if(copiar){
        this.copiarPortapapeles(JSON.stringify(this.storeVuenut))
      }
      console.log(texto);
      this.texto = texto?texto:this.texto
      console.log("hola copied");
      this.copiado = true
      setTimeout( () => {
        this.copiado = false
      }, 1500);
    },
    clickCircle(){
      this.visible = !this.visible
      console.log("hola click");
    },
    copiarPortapapeles(texto){
      // Crea un campo de texto "oculto"
      var aux = document.createElement("input");

      // Asigna el contenido del elemento especificado al valor del campo
      aux.setAttribute("value", texto);
      // arrayTextos = []
      // Añade el campo a la página
      document.body.appendChild(aux);

      // Selecciona el contenido del campo
      aux.select();

      // Copia el texto seleccionado
      document.execCommand("copy");

      // Elimina el campo de la página
      document.body.removeChild(aux);

      this.check = true

      setTimeout(() => {
        this.check = false
      }, 1000);
    }
  }
}
</script>

<style lang="css">
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'), local('MaterialIcons-Regular'), url(https://fonts.gstatic.com/s/materialicons/v17/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2) format('woff2');
}
.material-icons {
  font-family: 'Material Icons' !important;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
.contiene-vuenut * {
  margin: 0px;
  padding: 0px;
  font-family: arial;
  box-sizing: border-box;
  outline: none;
}
.con-prejson {
  padding: 10px;
}
.store-edit {
  width: 100%;
  height: 100%;
  position: relative;
}
.store-edit ul {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: rgb(var(--primary-vuenut));
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
}
.li-cancel {
  position: absolute;
  left: 15px;
}
.guardar-li {
  background: rgb(var(--gris-vuenut),.2);
  margin-left: 10px;
}
.store-edit ul li {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--fondo-vuenut));
  cursor: pointer;
  transition: all .3s ease;
  border-radius: 50%;
}
.store-edit ul li:hover {
  background: rgb(var(--secondary-vuenut),.2)
}
.store-edit ul li i {
  font-size: 20px;

}
.store-edit textarea {
  width: 100%;
  height: calc(100% - 50px);
  font-weight: bold;
  font-size: inherit;
  border: 0px;
  padding: 10px;
  resize: none;
  color: rgb(var(--secondary-vuenut));
  background: rgb(var(--fondo-vuenut));
  outline: none;
  max-height:none !important;
}
.store-edit textarea::selection {
  color: rgb(var(--fondo-vuenut));
  background: rgb(var(--secondary-vuenut));
}

:root {
  --primary-vuenut: 0, 198, 158;
  --secondary-vuenut: 67, 84, 102;
  --danger-vuenut: 255, 74, 74;
  --fondo-vuenut:255, 255, 255;
  --gris-vuenut:240, 240, 240;
}
*::-webkit-scrollbar{
  width: 5px;
  height: 5px;
}
*::-webkit-scrollbar-thumb{
  background: rgb(220, 220, 220);
  border-radius: 5px;
}
.hljs-name {
  color: rgba(var(--primary-vuenut),1);
}
.hljs-string {
  color: rgb(var(--secondary-vuenut)) !important;
}
.hljs-attr {
  color:rgba(var(--primary-vuenut),1);

}
.code {
  /* font-style: italic; */
  font-weight: normal;

  background: rgb(245, 245, 245);
  color: rgb(var(--secondary-vuenut));
  overflow: auto;
  max-height:300px;
  height: auto;
  opacity: 1;
  transition: all .3s;
  /* max-height: 300px; */
}
.soloJson {
  color: rgba(0, 0, 0, 0.6);
  font-weight: bold;
}
.fade-noti-enter-active, .fade-noti-leave-active {
  transition: all .3s;
}
.fade-noti-enter, .fade-noti-leave-to /* .fade-leave-active below version 2.1.8 */ {
  /* opacity: 0; */
  transform: translate(0,100%) !important;
}

.noti {
  width: 100%;
  background: rgb(var(--primary-vuenut));
  color: rgb(var(--fondo-vuenut));
  position: absolute;
  bottom: 0px;
  left: 0px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(0);
}
.noti i {
  margin-right: 10px;
}
.n-eliminar {
  background: rgb(var(--danger-vuenut));
}
.con-vuenut {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  background: rgb(var(--fondo-vuenut));
  height: 100vh;

  transition: all .3s ease;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.0);
  border-radius: 0px 10px 10px 0px;
  z-index: 200;
  position: relative;
}
.visiblex {
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  transform: translate(0) !important;
}
.arbolJson {
  font-weight: bold;
  color: rgb(var(--secondary-vuenut));
  overflow: auto;
  height: 100%;
}
.resizex {
  width: 100% !important;
}
/* .resizex .con-vuenut {
  width: 100% !important;
} */
.contiene-vuenut {
  position: fixed;
  z-index: 200000;
  display: block;
  top: 0px;
  left: 0px;
  transform: translate(-100%);
  transition: all .3s ease;
  width: 360px;
}
.con-funcionalidad {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
}
@media only screen and (max-width: 450px) {
  .contiene-vuenut {
    width: calc(100% - 60px);
  }
  .con-vuenut {
    /* width: calc(100% - 60px); */
  }

}

</style>
