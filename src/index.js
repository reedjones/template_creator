const template = document.createElement("template");
template.innerHTML = `
<style>
#container {
   display: grid; 

   grid-template-rows: auto minmax(200px, 90vh) auto;
   grid-template-columns:minmax(100px, 25%) 1fr;
   
   grid-template-areas: 
	'logo header'
	'sidebar main-content'
	'sidebar footer';
   
   gap: 3px;
   height: 100%;
   
}
  
#header {
display:flex; 
width:100%;
   background-color:yellow;
   grid-area: header;
   color:black;
   
}
#toolbar {

   background-color: green;
   grid-area: sidebar;
   
}
#main-content {

   background-color: red;
   grid-area: main-content;
   
}
#footer {

   background-color: #151127; 
   grid-area: footer;
   
}
#logo {
   width:60px;
   display:flex;
   background-color: purple; 
   grid-area: logo;
   
}ul {
  list-style:none;
}
</style>

<div class="angry-grid">
 
</div>
 
  <div id='container'  x-data="$el.parentElement.data()">
    <div id="logo"></div>
    <div id="header">
   header
 
    </div>
    <div id="toolbar">
    <ul>
    <template x-for="tool in tools">
        <li>
        <button x-text="tool.name"
        :data-tool-id="tool.id"
        @click="selectTool(
          $event.target.getAttribute('data-tool-id'))"></li>
        </li>
    </template>

</ul>
 <template x-if="activeTool !== null">
    <div> 
    <h5>active: <span x-text="activeTool.name"></span></h5></div>
</template>
<ul>
      <template x-for="[k,v] in Object.entries(saved)">
<li>
 <span x-text='k'></span>s
<ul>
<template x-for="item in v">
<li><span x-text='item.name'></span></li>
</template>
</ul>
</li>
      </template></ul>
    </div>
    <div id="main-content">

    <h1>Create template</h1>
    <div id="mainTemplateForm">
    <form>
<label>template name</label>
<input type='text' name='template-name'/>
<div>sections: <span x-text='saved.section.length'></span></div>
   
   <div>atoms: <span x-text='saved.atom.length'></span></div>
<div>components: <span x-text='saved.component.length'></span></div>

   
    </form>
    </div>
    
<div id='actions'>
<p> name: <span x-text='currentName'></span></p>
<template x-if='activeTool !== null'>
  <div> <button @click='saveNew'>Save</button></div>
</template>
</div>
    <div x-html="getFormContent">

    
    </div>
    
    </div>
    <div id="footer"></div>
  </div>

`;

function makeData(list){
  let i = 0; 
  let data = [];
  for (let item of list){
    let dat = {
      id: i, 
      name: item,
      selected:false,
    }
    data.push(dat)
    i++;
  }
  return data; 
}
let tools = [
 "section",
 "atom",
 "component"
];
const toolbox = makeData(tools);

export class MyCounter extends HTMLElement {
  connectedCallback() {
    this.append(template.content.cloneNode(true));
  }

  data() {
    return {
      activeTool:null,
      tools:toolbox,
      saved: {
        component:[],
        section:[],
        atom:[]
      },
      currentIdx: 1,
      currentName: "none",
      count: 0,
      fc:"<h2>Select a tool</h2>",
      getForm(tool){

          return `
         <div class='my-form'>
         <h2>Save a new ${tool.name}</h2>
         <label>Name</label>
 <input type='text' name='name'
 x-model='currentName'
          />
          <input type='hidden' value='${tool.name}'/>
         <div>
          
          `;

      },
      getFormContent(){
        if (this.activeTool){
          return String(this.getForm(this.activeTool))
        } else {
        return `<h2>Select a tool</h2>`

        }
      },
      getToolRegister(tool){
        return this.saved[tool.name]
      },
      saveNew(){
const clone = { ...this.activeTool };
const data = {
  name: this.currentName,
  id: this.currentIdx,
  componentData: clone
};
this.getToolRegister(clone).push(data);


this.currentIdx ++; 
      },
      getTool(i){
        console.log('selecting ', i);
        for(let tool of this.tools){
          console.log(tool)
          if (tool.id === i){ 
            console.log(tool)
            return tool;
            }
        }
      },
      selectTool(id){
        this.activeTool = this.getTool(Number(id));
        console.log(this.activeTool)
      },
      inc() {
        this.count++;
      },
      dec() {
        this.count--;
      },
    };
  }
}

customElements.define("my-counter", MyCounter);
