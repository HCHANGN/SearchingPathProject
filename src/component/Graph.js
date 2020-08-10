import React from "react";
import "../style/Graph.css"
import WeightedAlgo from "../WeightedAlgo";

class Graph extends React.Component{
    constructor(props){
        super(props);
        this.state={
            init:false,
            adjacencyList:{},
            adjacencyListTemp:null,
            w:Math.floor(window.innerWidth/30-5),
            preW:Math.floor(window.innerWidth/30-5),
            h:Math.floor(window.innerHeight/40-5),
            start:"0_0",
            end:"5_5",
            currentAlgo:null,
            visitedPath:[],
            pathWeight:[],
            shortestPath:[],
            speed:1,
            wall:[],
            weight:[],
            keypress:false,
            cStart:false,
            cEnd:false,
            addWeightMode:false,
            addWallMode:true,
            addWeightNum:10,
            SearchResult:[],
            shortestPathSetterData:[],
            currentTarget:null,
            introDivToggle:"none",
            actualCalTime:0,
            totalVisitedVertex:0,
            drawingState:false,
            selectedAlgo:null,
            isPlaying:false,
            currentPointing:null,
            pointerTemp:null,
            touchTarget:null,
            preTouchTarget:null
        }

        this.setter=()=>{
            if(this.state.currentAlgo==="aStar"){
                this.state.drawingState=true;
            }
            this.setterId = setInterval(()=>{
                if(this.state.SearchResult.length!=0){
                    let visitedV = this.state.SearchResult.shift();
                    this.setState({
                        visitedPath:[...this.state.visitedPath,visitedV]
                    })
                }
                else{
                    window.clearInterval(this.setterId);
                    this.state.isPlaying=false;
                    if(this.state.currentAlgo==="Dijkstra"||this.state.currentAlgo==="aStar"){
                        this.setterShort(this.state.shortestPathSetterData);
                        if(this.state.currentAlgo==="aStar"){
                            this.state.drawingState=false;
                        }
                    }
                }
            },this.state.speed)
        }

        this.addVertex=this.addVertex.bind(this);
        this.addEdge=this.addEdge.bind(this);
        this.addWeight=this.addWeight.bind(this);
        this.removeEdge=this.removeEdge.bind(this);
        this.initGraph=this.initGraph.bind(this);
        this.makeDrawData=this.makeDrawData.bind(this);
        this.DFSI=this.DFSI.bind(this);
        this.BFS=this.BFS.bind(this);
        this.reset=this.reset.bind(this);
        this.resetAll=this.resetAll.bind(this);
        this.dijkstra=this.dijkstra.bind(this);
        this.setterShort=this.setterShort.bind(this);
        this.setSpeed=this.setSpeed.bind(this);
        this.aStar=this.aStar.bind(this);
        this.selectAlgo=this.selectAlgo.bind(this);
        this.listenToResize=this.listenToResize.bind(this);
        this.listenStartPress=this.listenStartPress.bind(this);
        this.listenTouchMove=this.listenTouchMove.bind(this);
        this.listenTouchEnd=this.listenTouchEnd.bind(this);
        this.listenPointerMove=this.listenPointerMove.bind(this);
        this.listenMouseUp=this.listenMouseUp.bind(this);
        this.listenMouseMove=this.listenMouseMove.bind(this);
        this.listenMouseOut=this.listenMouseOut.bind(this);
        this.addRandomItem=this.addRandomItem.bind(this);
        this.setEuclideanDisToGraphWeight=this.setEuclideanDisToGraphWeight.bind(this);
    }

    componentDidMount(){
        window.addEventListener("touchstart", this.listenStartPress);
        window.addEventListener("touchmove", this.listenTouchMove);
        window.addEventListener("touchend", this.listenTouchEnd);
        window.addEventListener("resize", this.listenToResize);
        window.addEventListener("pointermove", this.listenPointerMove);
    }
    componentWillUnmount(){
        window.removeEventListener("touchstart", this.listenStartPress);
        window.removeEventListener("touchmove", this.listenTouchMove);
        window.removeEventListener("touchend", this.listenTouchEnd);
        window.removeEventListener("resize", this.listenToResize);
        window.removeEventListener("pointermove", this.listenPointerMove);
    }

    listenToResize(){
        console.log(Math.floor(window.innerWidth/30-5));
        this.state.w=Math.floor(window.innerWidth/30-5);
        if(this.state.w!=this.state.preW){
            this.state.h=Math.floor(window.innerHeight/40-5);
            this.state.start=`${Math.floor(this.state.w/3)}_${Math.floor(this.state.h/2)}`;
            this.state.end=`${Math.floor(this.state.w*2/3)}_${Math.floor(this.state.h/2)}`;
            this.resetAll();
            this.state.preW=this.state.w;
        }
    }

    listenStartPress(e){
        this.state.keypress=true;
        if(e.target.className==="startVertex"){
            this.state.cStart=true;
        }
        else if(e.target.className==="endVertex"){
            this.state.cEnd=true;
        }
    }

    listenTouchMove(e){
        this.state.touchTarget=document.elementFromPoint(e.targetTouches[0].clientX,e.targetTouches[0].clientY);
        if(this.state.touchTarget.id.split("_").length===1){
            this.state.keypress=false;
        }
        if(this.state.keypress){
            if(this.state.cStart||this.state.cEnd){
                if(this.state.preTouchTarget!=this.state.touchTarget&&this.state.preTouchTarget!=null){
                    if(this.state.cStart){
                        if(this.state.preTouchTarget.className==="endVertex"){
                            this.state.preTouchTarget.className="endVertex";
                            this.state.preTouchTarget.innerText="";
                        }
                        else{
                            this.state.preTouchTarget.className="vertex";
                            this.state.preTouchTarget.innerText="";
                        }
                    }
                    if(this.state.cEnd){
                        if(this.state.preTouchTarget.className==="startVertex"){
                            this.state.preTouchTarget.className="startVertex";
                            this.state.preTouchTarget.innerText="";
                        }
                        else{
                            this.state.preTouchTarget.className="vertex";
                            this.state.preTouchTarget.innerText="";
                        }
                    }
                }
                this.state.preTouchTarget=this.state.touchTarget;
            }

            if(this.state.touchTarget.className==="vertex"){
                if(this.state.addWeightMode){
                    this.addWeight(this.state.touchTarget.id,this.state.addWeightNum);
                }
                else{
                    this.removeEdge(this.state.touchTarget.id);
                }
            }
            if(this.state.touchTarget.className==="visited"){
                if(this.state.addWeightMode){
                    this.addWeight(this.state.touchTarget.id,this.state.addWeightNum);
                }
                else{
                    this.removeEdge(this.state.touchTarget.id);
                }
            }
            if(this.state.touchTarget.className==="SPath"){
                if(this.state.addWeightMode){
                    this.addWeight(this.state.touchTarget.id,this.state.addWeightNum);
                }
                else{
                    this.removeEdge(this.state.touchTarget.id);
                }
            }
            if(this.state.cStart){
                if(this.state.touchTarget.className!="endVertex"){
                    this.state.touchTarget.className="startVertex";
                    this.state.touchTarget.innerText="";
                }
            
            }
            if(this.state.cEnd){
                if(this.state.touchTarget.className!="startVertex"){
                    this.state.touchTarget.className="endVertex";
                    this.state.touchTarget.innerText="";
                }
            }
        }
    }

    listenTouchEnd(){
        if(this.state.touchTarget){
            let targetId=null;
            if(this.state.keypress){
                targetId=this.state.touchTarget.id;
                this.state.keypress=false;
            }
            else{
                targetId=this.state.preTouchTarget.id;
            }
            
            if(this.state.cStart){
                this.state.cStart=false;
                this.state.start=targetId;
                this.resetAll();
            }
            if(this.state.cEnd){
                this.state.cEnd=false;
                this.state.end=targetId;
                this.resetAll();
            }
        }
    }

    listenMouseUp(e){
        e.preventDefault();
        this.state.keypress=false;
        if(this.state.cStart){
            this.state.cStart=false;
            this.state.start=e.target.id;
            this.resetAll();
        }
        if(this.state.cEnd){
            this.state.cEnd=false;
            this.state.end=e.target.id;
            this.resetAll();
        }
    }

    listenMouseMove(e){
        e.preventDefault();
        if(this.state.keypress){
            if(e.target.className==="vertex"){
                if(this.state.addWeightMode){
                    this.addWeight(e.target.id,this.state.addWeightNum);
                }
                else{
                    this.removeEdge(e.target.id);
                }
            }
            if(e.target.className==="visited"){
                if(this.state.addWeightMode){
                    this.addWeight(e.target.id,this.state.addWeightNum);
                }
                else{
                    this.removeEdge(e.target.id);
                }
            }
            if(e.target.className==="SPath"){
                if(this.state.addWeightMode){
                    this.addWeight(e.target.id,this.state.addWeightNum);
                }
                else{
                    this.removeEdge(e.target.id);
                }
            }
            if(this.state.cStart){
                if(e.target.className!="endVertex"){
                    e.target.className="startVertex";
                    e.target.innerText="";
                }
            
            }
            if(this.state.cEnd){
                if(e.target.className!="startVertex"){
                    e.target.className="endVertex";
                    e.target.innerText="";
                }
            }
        }
    }

    listenMouseOut(e){
        e.preventDefault();
        if(this.state.cStart){
            if(e.target.className==="endVertex"){
                e.target.className="endVertex";
                e.target.innerText="";
            }
            else{
                e.target.className="vertex";
                e.target.innerText="";
            }
        }
        if(this.state.cEnd){
            if(e.target.className==="startVertex"){
                e.target.className="startVertex";
                e.target.innerText="";
            }
            else{
                e.target.className="vertex";
                e.target.innerText="";
            }
        }
    }

    listenPointerMove(e){
        this.state.currentPointing=e.target.className;
            if(this.state.currentPointing===""){
                this.state.keypress=false;
                if(this.state.cStart){
                    this.state.pointerTemp.className="startVertex";
                    this.state.cStart=false;
                    this.state.start=this.state.pointerTemp.id;
                    this.resetAll();
                }
                else if(this.state.cEnd){
                    this.state.pointerTemp.className="endVertex";
                    this.state.cEnd=false;
                    this.state.end=this.state.pointerTemp.id;
                    this.resetAll();
                }
            }
            else{
                if(this.state.cStart){
                    this.state.pointerTemp=e.target;
                }
                else if(this.state.cEnd){
                    this.state.pointerTemp=e.target;
                }
            }
    }

    addVertex(vertex){
        if(!this.state.adjacencyList[vertex]) this.state.adjacencyList[vertex]=[];
    }

    addEdge(vertex1,vertex2,weight){
        this.state.adjacencyList[vertex1].push({node:vertex2, weight});
        this.state.adjacencyList[vertex2].push({node:vertex1, weight});
    }

    addWeight(vertex,value){
        for(let item in this.state.adjacencyList){
            this.state.adjacencyList[item].forEach(nVertex=>{
                if(nVertex.node===vertex){
                    nVertex.weight=value;
                    this.setState(state=>({
                        weight:[...state.weight,nVertex.node]
                    }))
                }
            })
        }
    }

    changeMode(mode){
        if(mode==="weight"){
            this.setState({
                addWeightMode:true,
                addWallMode:false
            })
        }
        else{
            this.setState({
                addWeightMode:false,
                addWallMode:true
            })
        }
    }

    removeEdge(vertex){
        this.state.adjacencyList[vertex].forEach(item=>{
            this.state.adjacencyList[item.node]=this.state.adjacencyList[item.node].filter(itemN=>{
                return itemN.node!=vertex;
            })
        })
        this.state.adjacencyList[vertex]=[];
        this.setState(state =>({
            wall:[...state.wall,vertex]
        }));
    }

    initGraph(){
        let w=this.state.w;
        let h=this.state.h;
        for(let i=0;i<=w;i++){
            for(let j=0;j<=h;j++){
                this.addVertex(`${i}_${j}`);
                if(j!=0){
                    this.addEdge(`${i}_${j-1}`,`${i}_${j}`,1);
                }
                if(i!=0){
                    this.addEdge(`${i-1}_${j}`,`${i}_${j}`,1)
                }
            }
        }
    }

    resetAll(){
        this.setState({
            init:false,
            adjacencyList:{},
            visitedPath:[],
            pathWeight:[],
            shortestPath:[],
            wall:[],
            weight:[],
            SearchResult:[],
            shortestPathSetterData:[]
        })
    }

    reset(){
        this.state.visitedPath=[];
        this.state.pathWeight=[];
        this.state.shortestPath=[];
    }

    makeDrawData(){
        let counter=0;
        let graphArray=[];
        let tempArray=[];
        for(let vertex in this.state.adjacencyList){
            tempArray.push(vertex);
            if(counter===this.state.h){
                graphArray.push(tempArray);
                tempArray=[];
                counter=0;
            }
            else{
                counter++;
            }
        }
        return graphArray;
    }

    //search graph
    DFSI(){
        let startTime=performance.now();
        let dataStack=[];
        let result=[];
        let visited={};
        this.state.currentAlgo="DFSBFS";
        this.reset();
        clearInterval(this.setterId);

        dataStack.push(this.state.start);

        while(dataStack.length!=0){
            let data=dataStack.pop();
            if(data===this.state.end){
                break;
            }
            if(!visited.hasOwnProperty(data)){
                result.push(data);
                visited[data]=true;
                this.state.adjacencyList[data].forEach(e=>{
                    if(!visited.hasOwnProperty(e.node)){
                        dataStack.push(e.node);
                    }
                })
            }
        }
        this.state.SearchResult=result;
        this.state.actualCalTime=performance.now()-startTime;
        this.state.totalVisitedVertex=result.length;
        return result;
    }

    BFS(){
        let startTime=performance.now();
        let result=[];
        let visited={};
        let dataQueue=[];
        this.state.currentAlgo="DFSBFS";
        this.reset();
        clearInterval(this.setterId);

        dataQueue.push(this.state.start);
        while(dataQueue.length!=0){
            let data=dataQueue.shift();
            if(data===this.state.end){
                break;
            }
            if(!visited.hasOwnProperty(data)){
                result.push(data);
                visited[data]=true;
                this.state.adjacencyList[data].forEach(e=>{
                    if(!visited.hasOwnProperty(e.node)){
                        dataQueue.push(e.node);
                    }
                })
            }
        }
        this.state.SearchResult=result;
        this.state.actualCalTime=performance.now()-startTime;
        this.state.totalVisitedVertex=result.length;
        return result;
    }

    dijkstra(){
        let startTime=performance.now();
        this.state.visitedPath=[];
        this.state.currentAlgo="Dijkstra";
        let weightedAlgo = new WeightedAlgo(this.state.adjacencyList,this.state.start,this.state.end);
        clearInterval(this.setterId);
        if(this.state.drawingState){
            if(this.state.adjacencyListTemp){
                this.state.adjacencyList=JSON.parse(JSON.stringify(this.state.adjacencyListTemp));
                this.state.drawingState=false;
            }
        }
        weightedAlgo.setupInitState();
        weightedAlgo.searchingShortestPathToEachVertex();
        this.state.pathWeight=weightedAlgo.pathWeight;
        this.state.shortestPath=[];
        weightedAlgo.setShortestPath();
        this.state.shortestPathSetterData=weightedAlgo.shortestPath;
        this.state.SearchResult=weightedAlgo.path;
        this.state.actualCalTime=performance.now()-startTime;
        this.state.totalVisitedVertex=weightedAlgo.path.length;
        return null;
    }
    
    setEuclideanDisToGraphWeight(){
        let startx = this.state.start.split("_")[0];
        let starty = this.state.start.split("_")[1];
        let endx = this.state.end.split("_")[0];
        let endy = this.state.end.split("_")[1];
        for(let vertex in this.state.adjacencyList){
            this.state.adjacencyList[vertex].forEach(item=>{
                let itemx = item.node.split("_")[0];
                let itemy = item.node.split("_")[1];
                let sToT = Math.sqrt(Math.abs(startx-itemx)*Math.abs(startx-itemx)+Math.abs(starty-itemy)*Math.abs(starty-itemy));
                let tToE = Math.sqrt(Math.abs(endx-itemx)*Math.abs(endx-itemx)+Math.abs(endy-itemy)*Math.abs(endy-itemy));
                let hWeight = Math.floor((sToT+tToE));
                item.weight+=hWeight;
            })
        }
    }

    aStar(){
        let startTime=performance.now();
        this.state.visitedPath=[];
        this.state.currentAlgo="aStar";
        let weightedAlgo = new WeightedAlgo(this.state.adjacencyList,this.state.start,this.state.end);
        clearInterval(this.setterId);
        this.state.adjacencyListTemp=JSON.parse(JSON.stringify(this.state.adjacencyList));
        this.setEuclideanDisToGraphWeight();
        weightedAlgo.setupInitState();
        weightedAlgo.searchingShortestPathToEachVertex();
        this.state.pathWeight=weightedAlgo.pathWeight;
        this.state.shortestPath=[];
        weightedAlgo.setShortestPath();
        this.state.shortestPathSetterData=weightedAlgo.shortestPath;
        this.state.SearchResult=weightedAlgo.path;
        this.state.actualCalTime=performance.now()-startTime;
        this.state.totalVisitedVertex=weightedAlgo.path.length;
        this.state.adjacencyList=JSON.parse(JSON.stringify(this.state.adjacencyListTemp));
        return null;
    }

    //shortest path animation setter
    setterShort(shortestPath){ 
        let setterShort = setInterval(()=>{
            if(shortestPath.length!=0){
                let visitedV = shortestPath.shift();
                this.setState({
                    shortestPath:[...this.state.shortestPath,visitedV]
                })
            }
            else{
                clearInterval(setterShort);
            }
        },this.state.speed)
    }

    setSpeed(value){
        this.setState({
            speed:Number(value)
        })
    }

    selectAlgo(name){
        if(name=="DFS"){
            this.DFSI();
        }
        else if(name=="BFS"){
            this.BFS();
        }
        else if(name=="Dijk"){
            this.dijkstra();
        }
        else if(name=="Astar"){
            this.aStar();
        }
        else{
            alert("Please select algorithm first!");
        }
    }

    addRandomItem(){
        this.setState({
            init:false,
            adjacencyList:{},
            visitedPath:[],
            pathWeight:[],
            shortestPath:[],
            wall:[],
            weight:[],
            SearchResult:[],
            shortestPathSetterData:[]
        },()=>{
            if(this.state.addWallMode){
                console.log("add random wall!");
                    for( let item in this.state.adjacencyList){
                        let randomNum = Math.random();
                        if(randomNum<=0.3){
                            if(item!==this.state.start&&item!==this.state.end){
                                this.removeEdge(item);
                            }
                        }
                    }
            }
            else if(this.state.addWeightMode){
                console.log("add random weight!");
                for( let item in this.state.adjacencyList){
                    let randomNum = Math.random();
                        if(randomNum<=0.3){
                            if(item!==this.state.start&&item!==this.state.end){
                                this.addWeight(item,this.state.addWeightNum);
                            }
                        }
                }
            }
        });
    }

    render(){
        if(!this.state.init){
            this.initGraph();
            this.state.init=true;
        }
        let graphData = this.makeDrawData();

        return(
            <div id="container">
                <div id="controlBar">
                    <div id="algoControl">
                        <div id="algoControlTitle">Select Algorithm</div>
                        <div id="algoControlSelectDiv">
                            <select name="algo" id="algoSelect" onChange={(e)=>{
                                this.state.selectedAlgo=e.target.value;
                                clearInterval(this.setterId);
                                this.state.isPlaying=false;
                                }}>
                                <option value="notYetSelect">--Select your Algorithm--</option>
                                <option value="DFS">Depth First Search</option>
                                <option value="BFS">Breadth First Search</option>
                                <option value="Dijk">Dijkstra Algorithm</option>
                                <option value="Astar">A* Algorithm</option>
                            </select>
                        </div>
                        <div id="calResult">
                            <div id="searchTimeResult">
                                <div>
                                    Actual search Time: {this.state.actualCalTime.toFixed(2)} ms
                                </div>
                            </div>
                            <div id="visitedVertexResult">
                                <div>
                                    Total visited vertex: {this.state.totalVisitedVertex}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="playControl">
                        <div id="playControlTitle">Control panel</div>
                        <div id="playControlBtn">
                            <div id="controlBtnSet">
                                <div onClick={()=>{
                                    clearInterval(this.setterId);
                                    if(!this.state.isPlaying){
                                        this.selectAlgo(this.state.selectedAlgo);
                                        this.state.isPlaying=true;
                                        this.setter();
                                    }
                                    else{
                                        this.state.isPlaying=false;
                                    }
                                }}><img src="./img/playIcon.svg" id="playIcon"></img></div>
                                <div onClick={()=>{clearInterval(this.setterId)}}><img src="./img/pauseIcon.svg" id="pauseIcon"></img></div>
                                <div onClick={this.resetAll}><img src="./img/restartIcon.svg" id="restartIcon"></img></div>
                            </div>
                            <div id="speedRange">
                                <div>- &nbsp; Time Step &nbsp; +</div>
                                <input type="range" min="1" max="500" onChange={(e)=>{
                                    this.setSpeed(e.target.value);
                                    clearInterval(this.setterId);
                                    this.setter();
                                    }}></input>
                            </div>
                        </div>
                    </div>

                    <div id="addControl">
                        <div id="addControlTitle">Select add mode</div>
                        <div id="addModeSelectDiv">
                            <select name="addMode" id="modeSelect" onChange={(e)=>{this.changeMode(e.target.value);}}>
                                <option value="wall">Wall</option>
                                <option value="weight">Weight</option>
                            </select>
                        </div>
                        <div id="addRandomBtn">
                            <button onClick={()=>{this.addRandomItem();}}>Add Random</button>
                        </div>
                    </div>
                </div>
                <div id="introIcon" onClick={()=>{
                    if(this.state.introDivToggle=="none"){
                        this.setState({
                            introDivToggle:"flex"
                        })
                    }
                    else{
                        this.setState({
                            introDivToggle:"none"
                        })
                    }
                }}>
                    ?
                </div>

                <div id="graphIntroContainer" style={{display:this.state.introDivToggle}}>
                    <div id="graphIntroTitle">Intro of Graph</div>
                    <div id="startIntro">
                        <div id="startIntroBox"></div>
                        <div id="startIntroText">&nbsp;:&nbsp;Start</div>
                    </div>
                    <div id="endIntro">
                        <div id="endIntroBox"></div>
                        <div id="endIntroText">&nbsp;:&nbsp;End</div>
                    </div>
                    <div id="visitedIntro">
                        <div id="visitedIntroBox"></div>
                        <div id="visitedIntroText">&nbsp;:&nbsp;Visited</div>
                    </div>
                    <div id="wallIntro">
                        <div id="wallIntroBox"></div>
                        <div id="wallIntroText">&nbsp;:&nbsp;Wall</div>
                    </div>
                    <div id="weightIntro">
                        <div id="weightIntroBox"></div>
                        <div id="weightIntroText">&nbsp;:&nbsp;Weight</div>
                    </div>
                    <div id="SPIntro">
                        <div id="SPIntroBox"></div>
                        <div id="SPIntroText">&nbsp;:&nbsp;Shortest Path</div>
                    </div>
                </div>
                
                <div id="graphContainer" 
                    onMouseDown={this.listenStartPress}
                    onMouseUp={this.listenMouseUp}
                    onMouseMove={this.listenMouseMove}
                    onMouseOut={this.listenMouseOut}
                >
                    {graphData.map(item=>{
                        return <div key={"row"+item[0]}>{item.map(vertex=>{
                            if(this.state.wall.indexOf(vertex)!=-1){
                                return <div key={vertex} id={vertex} className="wall"></div>
                            }
                            if(vertex===this.state.start){
                                return <div key={vertex} id={vertex} className="startVertex"></div>
                            }
                            if(vertex===this.state.end){
                                return <div key={vertex} id={vertex} className="endVertex"></div>
                            }
                            if(this.state.visitedPath){
                                if(this.state.visitedPath.indexOf(vertex)!=-1){
                                    if(this.state.shortestPath.indexOf(vertex)!=-1){
                                        return <div key={vertex} id={vertex} className="SPath"></div>
                                    }
                                    else{
                                        if(this.state.pathWeight[0]){
                                            let weight = this.state.pathWeight.filter(item=>{return item[0]==vertex});
                                            if(weight[0][0]){
                                                if(this.state.weight.indexOf(vertex)!=-1){
                                                    return <div key={vertex} id={vertex} className="weight">{weight[0][1]}</div>
                                                }
                                                return <div key={vertex} id={vertex} className="visited">{weight[0][1]}</div>
                                            }
                                        }
                                        return <div key={vertex} id={vertex} className="visited"></div>
                                    }
                                }
                            }
                            if(this.state.weight.indexOf(vertex)!=-1){
                                return <div key={vertex} id={vertex} className="weight">{this.state.addWeightNum}</div>
                            }
                            return <div key={vertex} id={vertex} className="vertex"></div>
                        })}</div>
                    })}
                </div>
            </div>   
        )
    }
}
export default Graph;
