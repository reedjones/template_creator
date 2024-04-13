const template = document.createElement("template");

template.innerHTML = `


<style>
#container {
   display: grid; 

   grid-template-rows: auto minmax(200px, 90vh) auto;
   grid-template-columns:minmax(60px, 20%) 1fr minmax(60px, 20%);
   
   grid-template-areas: 
	'logo header toolbar'
	'sidebar main-content toolbar'
	'sidebar footer toolbar';
   height: 100%;
   
}
  
#header {
display:flex; 

   background-color:yellow;
   grid-area: header;
   color:black;
   
}
#toolbar {

   background-color: green;
   grid-area: sidebar;
   
}

#toolbar2 {
  grid-area:toolbar;
  background-color:blue;
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
   
}
ul {
  list-style:none;
  padding:0;
  margin:0;
  padding-inline:0;
  padding-inline-start:0;
}
</style>

<div id="container"  x-data="$el.parentElement.data()">
    <div id="logo"></div>
    <div id="header">
        header
    </div>
    <div id="toolbar">
    <ul class="p-2">
        <template x-for="tool in tools">
            <li class="m-1">
            <button class="bg-blue bg-dark" x-text="tool.name"
            :data-tool-id="tool.id"
            @click="selectTool(
              $event.target.getAttribute('data-tool-id'))"></li>
            </li>
        </template>
    </ul>
     <template x-if="activeTool !== null">
        <div class="p-2"> 
        <h5>active: <span x-text="activeTool.name"></span></h5></div>
    </template>

    <span class="mt-5 p-2">
    Created: 
    </span>
    <ul class="m-1 p-2">
       <template x-for="[k,v] in Object.entries(saved)">
         <li>
             <span x-text="k"></span>s
            <ul>
            <template x-for="item in v">
                <li>
                    <span x-text="item.name"></span>
                </li>
            </template>
            </ul>
        </li>
      </template>
    </ul>
    </div>
    <div id="main-content" class="m-1 p-2">




 

    
    </div>
    <div id="toolbar2">
    
     <h1>Create template</h1>
    <div id="mainTemplateForm" class="p-4">
    <form>
        <div  class="p-2 my-2">
            <label>template name</label>
            <input type="text" name="template-name"/>
        </div>
        
        <div class="p-2 my-2 text-sm text-right">
          Info:
            <div>sections: <span x-text="saved.section.length"></span></div>
            <div>atoms: <span x-text="saved.atom.length"></span></div>
            <div>components: <span x-text="saved.component.length"></span></div>
        </div>
    </form>
       
    </div>
    
    <div id="actions" class="m-2">
        <p> editing: <span x-text="currentName"></span></p>
    </div>
    <div x-html="getFormContent" class="my-2">
    </div>

    <template x-if="activeTool !== null">
      <div> 
        <button @click="saveNew">Save</button>
      </div>
    </template>
    
    
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
