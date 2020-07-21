import React from "react";
import "./Graph.css";
import PriorityQueue from "./priorityQueue";


class Graph extends React.Component{
    constructor(props){
        super(props);
        this.state={
            init:false,
            adjacencyList:{},
            adjacencyListTemp:null,
            w:40,
            h:15,
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
            DijkstraShortestPath:[],
            currentTarget:null,
            introDivToggle:"none",
            actualCalTime:0,
            totalVisitedVertex:0,
            drawingState:false
        }

        this.setter=()=>{
            this.setterId = setInterval(()=>{
                this.state.currentAlgo="DFSBFS";
                if(this.state.SearchResult.length!=0){
                    let visitedV = this.state.SearchResult.shift();
                    this.setState({
                        visitedPath:[...this.state.visitedPath,visitedV]
                    })
                }
                else{
                    window.clearInterval(this.setterId);
                }
                //console.log(result.length);
            },this.state.speed)
        }

        this.DijkstraSetter=()=>{
            this.state.currentAlgo="Dijkstra";
            this.setterId = setInterval(()=>{
                if(this.state.SearchResult.length!=0){
                    let visitedV = this.state.SearchResult.shift();
                    this.setState({
                        visitedPath:[...this.state.visitedPath,visitedV]
                    })
                }
                else{
                    window.clearInterval(this.setterId);
                    this.setterShort(this.state.DijkstraShortestPath);
                    // if(this.state.adjacencyListTemp){
                    //     this.state.adjacencyList=JSON.parse(JSON.stringify(this.state.adjacencyListTemp));
                    // }
                }
            },this.state.speed)
        }

        this.aStarSetter=()=>{
            this.state.currentAlgo="aStar";
            this.state.drawingState=true;
            this.setterId = setInterval(()=>{
                if(this.state.SearchResult.length!=0){
                    let visitedV = this.state.SearchResult.shift();
                    this.setState({
                        visitedPath:[...this.state.visitedPath,visitedV]
                    })
                }
                else{
                    window.clearInterval(this.setterId);
                    this.setterShort(this.state.DijkstraShortestPath);
                    if(this.state.adjacencyListTemp){
                        this.state.adjacencyList=JSON.parse(JSON.stringify(this.state.adjacencyListTemp));
                    }
                    this.state.drawingState=false;
                }
                //console.log(result.length);
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
        //this.setter=this.setter.bind(this);
        //this.setAddWeightNum=this.setAddWeightNum.bind(this);
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
                    this.setState({
                        weight:[...this.state.weight,nVertex.node]
                    })
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
        this.setState({
            wall:[...this.state.wall,vertex]
        })
        //console.log(this.state.adjacencyList);
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
            DijkstraShortestPath:[]
            //start:"0_0",
            //end:"5_5"
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
        this.setter();
        this.state.actualCalTime=performance.now()-startTime;
        this.state.totalVisitedVertex=result.length;
        return result;
    }

    BFS(){
        let startTime=performance.now();
        let result=[];
        let visited={};
        let dataQueue=[];
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
        this.setter();
        this.state.actualCalTime=performance.now()-startTime;
        this.state.totalVisitedVertex=result.length;
        return result;
    }

    ///Dijkstra!!!!

    dijkstra(){
        let startTime=performance.now();
        let distances = {};
        let pQueue = new PriorityQueue();
        let previous = {};
        let path = [];
        let pathWeight = [];
        this.state.visitedPath=[];
        clearInterval(this.setterId);
        if(this.state.drawingState){
            if(this.state.adjacencyListTemp){
                this.state.adjacencyList=JSON.parse(JSON.stringify(this.state.adjacencyListTemp));
                this.state.drawingState=false;
            }
        }

        // this.state.adjacencyListTemp=JSON.parse(JSON.stringify(this.state.adjacencyList));
        
        //build up initial state
        for(let vertex in this.state.adjacencyList){
            if(vertex===this.state.start){
                distances[vertex]=0;
                pQueue.enqueue(vertex,0);
            }
            else{
                distances[vertex]=Infinity;
                pQueue.enqueue(vertex,Infinity);
            }
            previous[vertex]=null;
        }

        //start looping queue
        
        while(pQueue.values.length!=0){
            let current = pQueue.dequeue();
            if(current.val==="0_0"&&current.priority===Infinity){
                break;
            }
            if(current.val==="0_1"&&current.priority===Infinity){
                break;
            }
            if(current.val===this.state.end){
                break;
            }
            path.push(current.val);
            pathWeight.push([current.val,distances[current.val]]);
            //console.log(path);
            this.state.adjacencyList[current.val].forEach(linkedVertex=>{
                let totalDis = linkedVertex.weight+distances[current.val];
                //pathWeight.push([linkedVertex.node,totalDis]);
                if(distances[linkedVertex.node]>totalDis){
                    distances[linkedVertex.node]=totalDis;
                    previous[linkedVertex.node]=current.val;
                    pQueue.enqueue(linkedVertex.node,totalDis);
                }
            })
        }
        this.state.pathWeight=pathWeight;
        //console.log(this.state.pathWeight);

        //set shortest path
        let shortestPath = [];
        let tempV = previous[this.state.end];

        this.state.shortestPath=[];
        while(tempV!=null){
            shortestPath.unshift(tempV);
            tempV=previous[tempV];
        }
        shortestPath.shift();
        //console.log(shortestPath);
        this.state.DijkstraShortestPath=shortestPath;
        //set animation data
        this.state.SearchResult=path;
        this.DijkstraSetter();
        // this.setterId = setInterval(()=>{
        //     if(path.length!=0){
        //         let visitedV = path.shift();
        //         this.setState({
        //             visitedPath:[...this.state.visitedPath,visitedV],
        //         })
        //     }
        //     else{
        //         clearInterval(this.setterId);
        //         this.setterShort(shortestPath);
        //     }
            
        // },this.state.speed)
        
        //console.log(this.state.pathWeight);
        //console.log(pathWeight);
        // console.log(distances);
        this.state.actualCalTime=performance.now()-startTime;
        this.state.totalVisitedVertex=path.length;
        return previous;
    }

    aStar(){
        let startTime=performance.now();
        let distances = {};
        let pQueue = new PriorityQueue();
        let previous = {};
        let path = [];
        let pathWeight = [];
        this.state.visitedPath=[];
        if(this.setterId){
            console.log(this.setterId);
        }
        clearInterval(this.setterId);

        this.state.adjacencyListTemp=JSON.parse(JSON.stringify(this.state.adjacencyList));

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

        //build up initial state
        for(let vertex in this.state.adjacencyList){
            if(vertex===this.state.start){
                distances[vertex]=0;
                pQueue.enqueue(vertex,0);
            }
            else{
                distances[vertex]=Infinity;
                pQueue.enqueue(vertex,Infinity);
            }
            previous[vertex]=null;
        }

        //start looping queue
        while(pQueue.values.length!=0){
            let current = pQueue.dequeue();
            if(current.val==="0_0"&&current.priority===Infinity){
                break;
            }
            if(current.val==="0_1"&&current.priority===Infinity){
                break;
            }
            if(current.val===this.state.end){
                break;
            }
            path.push(current.val);
            pathWeight.push([current.val,distances[current.val]]);
            this.state.adjacencyList[current.val].forEach(linkedVertex=>{
                let totalDis = linkedVertex.weight+distances[current.val];
                if(distances[linkedVertex.node]>totalDis){
                    distances[linkedVertex.node]=totalDis;
                    previous[linkedVertex.node]=current.val;
                    pQueue.enqueue(linkedVertex.node,totalDis);
                }
            })
        }
        this.state.pathWeight=pathWeight;

        //set shortest path
        let shortestPath = [];
        let tempV = previous[this.state.end];

        this.state.shortestPath=[];
        while(tempV!=null){
            shortestPath.unshift(tempV);
            tempV=previous[tempV];
        }
        shortestPath.shift();
        this.state.DijkstraShortestPath=shortestPath;
        //set animation data
        this.state.SearchResult=path;
        this.aStarSetter();
        this.state.actualCalTime=performance.now()-startTime;
        this.state.totalVisitedVertex=path.length;
        return previous;
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


    ///// View part

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
                        <div id="algoControlTitle">Run Algorithm</div>
                        <div id="algoControlBtn">
                            <button onClick={this.DFSI}>Start DFS</button>
                            <button onClick={this.BFS}>Start BFS</button>
                            <button onClick={this.dijkstra}>Start Dijkstra</button>
                            <button onClick={this.aStar}>Start A*</button>
                        </div>
                        <div id="calResult">
                        <div id="searchTimeResult">
                            <div>
                                Actual search Time: {this.state.actualCalTime} ms
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
                        <div id="playControlTitle">Animate control panel</div>
                        <div id="playControlBtn">
                            <button onClick={()=>{
                                clearInterval(this.setterId);
                                if(this.state.currentAlgo=="DFSBFS"){
                                    this.setter();
                                }
                                else if(this.state.currentAlgo==="Dijkstra"){
                                    this.DijkstraSetter();
                                }
                                else if(this.state.currentAlgo==="aStar"){
                                    this.aStarSetter();
                                }
                            }}>Resume</button>
                            <button onClick={()=>{clearInterval(this.setterId)}}>Pause</button>
                            <button onClick={this.resetAll}>Reset</button>
                            <div id="speedRange">
                                <div>- &nbsp; Time Step &nbsp; +</div>
                                <input type="range" min="1" max="500" onChange={(e)=>{
                                    this.setSpeed(e.target.value);
                                    clearInterval(this.setterId);
                                    if(this.state.currentAlgo=="DFSBFS"){
                                        this.setter();
                                    }
                                    else if(this.state.currentAlgo==="Dijkstra"){
                                        this.DijkstraSetter();
                                    }
                                    else if(this.state.currentAlgo==="aStar"){
                                        this.aStarSetter();
                                    }
                                    }}></input>
                            </div>
                        </div>
                    </div>

                    <div id="addControl">
                        <div id="addControlTitle">Add item to graph</div>
                        <div id="addControlBtn">
                            <button onClick={()=>{this.changeMode("weight");}}>Add Weight</button>
                            <button onClick={()=>{this.changeMode("wall")}}>Add Wall</button>
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
                    onMouseDown={(e)=>{
                        e.preventDefault();
                        this.setState({
                            keypress:true
                        })
                        if(e.target.className==="startVertex"){
                            this.setState({
                                cStart:true
                            })
                        }
                        if(e.target.className==="endVertex"){
                            this.setState({
                                cEnd:true
                            })
                        }
                    }}
                    onMouseUp={(e)=>{
                        e.preventDefault();
                        this.setState({
                            keypress:false
                        })
                        if(this.state.cStart){
                            this.setState({
                                cStart:false,
                                start:e.target.id
                            })
                            this.resetAll();
                            //this.reset();
                        }
                        if(this.state.cEnd){
                            this.setState({
                                cEnd:false,
                                end:e.target.id
                            })
                            this.resetAll();
                            //this.reset();
                        }
                    }}
                    onMouseMove={(e)=>{
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
                                //this.removeEdge(e.target.id);
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
                    }}
                    onMouseOut={(e)=>{
                        e.preventDefault();
                        if(this.state.cStart){
                            if(e.target.className==="endVertex"){
                                e.target.className="endVertex";
                                e.target.innerText="";
                            }
                            else{
                                console.log(e.target.className);
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
                    }}
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
