import React, { Component } from 'react';
import "./App.css";

import * as d3 from "d3";
import data from "./yemen.json";
import Depot from "./components/depot.js";

const margin = {top: 80, right: 20, bottom: 50, left: 60};
const steps = 10;

//some geo coordinates of various cities
let truck1 = [
  {long: 45, lat: 12.8},
  {long: 44.7, lat: 13},
  {long: 45, lat: 14},
  {long: 45, lat: 14.4},
  {long: 45.2, lat: 14.6},
  {long: 45.3, lat: 15.4},
  {long: 45.1, lat: 14.8},
  {long: 44.8, lat: 14.7},
  {long: 44.7, lat: 15.4},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
];

let truck2 = [
  {long: 45, lat: 12.8},
  {long: 44.65, lat: 13.05},
  {long: 45, lat: 14},
  {long: 44.99, lat: 14.4},
  {long: 44.7, lat: 15.3},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
  {long: 44, lat: 16},
];

let truck3 = [
  {long: 45, lat: 12.8},
  {long: 45.55, lat: 13.3},
  {long: 46.3, lat: 13.55},
  {long: 46.8, lat: 13.6},
  {long: 47, lat: 13.7},
  {long: 47.5, lat: 14.1},
  {long: 47.9, lat: 14.4},
  {long: 48, lat: 15},

  {long: 48.2, lat: 15.4},
  {long: 48.7, lat: 16},
  {long: 48.8, lat: 16.7},
  {long: 49, lat: 16.9},
  {long: 49, lat: 16.9},
  {long: 49, lat: 16.9},
  {long: 49.5, lat: 17.5},
  {long: 49.7, lat: 17.7},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
];

let truck4 = [
  {long: 45, lat: 12.8},
  {long: 45.5, lat: 13.35},
  {long: 46.3, lat: 13.5},
  {long: 46.8, lat: 13.65},
  {long: 47.05, lat: 13.75},
  {long: 47.55, lat: 14.1},
  {long: 47.9, lat: 14.4},
  {long: 48, lat: 15},

  {long: 48.2, lat: 15},
  {long: 48.73, lat: 15.4},
  {long: 49.05, lat: 15.93},
  {long: 49.4, lat: 16.5},
  {long: 49.53, lat: 16.9},
  {long: 49.75, lat: 17.55},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
  {long: 50, lat: 18},
];

let trucks = [
  {
    color: "magenta",
    coords: expandCoords(truck1, steps)
  },
  {
    color: "blue",
    coords: expandCoords(truck2, steps)
  },
  {
    color: "magenta",
    coords: expandCoords(truck3, steps)
  },
  {
    color: "blue",
    coords: expandCoords(truck4, steps)
  },
];



let depots = [
  {long: 45, lat: 14, rfid: expandNumbers([0,0,0,94,94,94,94,94,94,94,94,94,94,94,94,94,94,94,94,94], steps)},
  {long: 44, lat: 16, rfid: expandNumbers([0,0,0,0,0,0,48,48,48,48,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76], steps)},
  {long: 48, lat: 15, rfid: expandNumbers([0,0,0,0,0,0,0,0,95,95,95,95,95,95,95,95,95,95,95,95,95], steps)},
  {long: 50, lat: 18, rfid: expandNumbers([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,48,93,93,93], steps)},
];


let barcodes = [
  expandBarcodes({long: depots[1].long, lat: depots[1].lat}, [0,0,0,0,0,5,5,5,5,5,5,5,5,2,2,2,2,2,2,2], steps),
  expandBarcodes({long: depots[3].long, lat: depots[3].lat}, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,10,10,5,5], steps)
];



//takes an array of numbers and expands them by the number of steps provided
//ex: an array [0,10] with step 10 would be expanded to roughly [0,1,2,3,4,5,6,7,8,9,10]
//this way you only need to specify a few general checkpoints you want the numbers to reach without having to manually specify every value
//the other expand functions operate similarly
function expandCoords(coords, steps) {
  let expanded = []; //initialize array that will be returned eventually
  //loop through every element except the last one (since hte last one doesn't have a following element to expand to)
  for(let i=0; i<coords.length-1; ++i) {
    let dLong = (coords[i+1].long - coords[i].long) / steps; //get the change in longitude
    let dLat = (coords[i+1].lat - coords[i].lat) / steps; //get the change in latitude
    for(let j=0; j<steps; ++j) {
      expanded.push({long: coords[i].long + j*dLong, lat: coords[i].lat + j*dLat}); //push elements with coordinates incremented by the changes in longitude and latitude
    }
  }

  return expanded; //return empty array
}

//similar to expandCoords, but expands raw numbers
function expandNumbers(numbers, steps) {
  let expanded = [];
  for(let i=0; i<numbers.length-1; ++i) {
    let d = (numbers[i+1] - numbers[i]) / steps;
    for(let j=0; j<steps; ++j) {
      expanded.push(numbers[i] + j*d);
    }
  }

  return expanded;
}

//returns a 2d array of randomized dots based on a given geographical center
//similar to expandCoords, but instead returns a 2D array in this format
//[ [dots to draw at index 0], [dots to draw at index 1], ... ]
//dots to draw at index i: [ {long: , lat: }, {long: , lat: }, ... ]
//the center argument is the geographical center in the format {long: , lat: } around which to randomize dots
function expandBarcodes(center, barcodes, steps) {
  let expanded = [];
  for(let i=0; i<barcodes.length; ++i) {
    let d = barcodes[i] / steps; //the number of dots to draw at each step
    //sum is used to keep track of whether there should be a dot drawn here or not
    //for example, imagine that we want to draw 5 dots over the course of 10 steps
    //in practice we would then draw one dot every other step
    //d = 5/10 = 0.5, so to draw a dot every other step, we only want to draw a dot if the sum is greater than 1
    //on every iteration, we increment the sum by d. if the sum is >= 1, we draw a dot then subtract by 1
    //this way we can loosely spread out the dots
    let sum = d; //initialize sum to d
    for(let j=0; j<steps; ++j) {
      expanded.push([]); //push an empty array
      //if the sum is greater than one, that means we should add dots to draw
      if(sum >= 1) {
        //for each dot we're supposed to draw
        for(let k=0; k<d; ++k) {
          //push an element with a randomized geolocation close to the center
          expanded[expanded.length-1].push({
            long: randomCoord(center.long, 1), lat: randomCoord(center.lat, 1)
          });
        }
        sum -= 1; //subtract 1 from the sum
      }

      sum += d; //increment by d
    }
  }

  return expanded;
}

//returns a random number centered on "coord"
//the spread of the distribution scales linearly with "scale"
function randomCoord(coord, scale) {
  return scale*(Math.random() - 0.5) + coord;
}

class App extends Component {
  constructor(props) {
    super(props);

    let width = 800 - margin.left - margin.right;
    let height = 800 - margin.top - margin.bottom;

    this.state = {
      width: width,
      height: height,
      projection: d3.geoMercator()
      .center([48.5, 15])
      .translate([ width/2, height/2 ])
      .scale([ width/0.25 ]),
      dragging: false,

      index: 0,
    };

    this.myContent = React.createRef();

    this.resize = this.resize.bind(this);
    this.zoom = this.zoom.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.toggleTracking = this.toggleTracking.bind(this);
    this.nextIndex = this.nextIndex.bind(this);
  }


  componentDidMount() {
    window.addEventListener('resize', this.resize); //add resize listener for responsiveness

    this.resize(); //initial resize
  }


  resize() {
    if(this.myContent.current) {
      let width = this.myContent.current.offsetWidth - margin.left - margin.right;
      let height = this.myContent.current.offsetHeight - margin.top - margin.bottom
      this.setState({
        width: width,
        height: height,
        projection: this.state.projection.center([48.5, 15]).translate([ width/2, height/2 ]).scale([ Math.pow(width,1.08) + 1000 ])
      });
    }
    else {
      this.setState({width: 1000, height: 1000});
    }
  }

  zoom(e) {
    let projection = this.state.projection;
    let currScale = projection.scale();
    let newScale = currScale - 50*e.deltaY;
    let currTranslate = projection.translate();
    let coords = projection.invert([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
    projection.scale(newScale);
    let newPos = projection(coords);
    projection.translate([currTranslate[0] + (e.nativeEvent.offsetX - newPos[0]), currTranslate[1] + (e.nativeEvent.offsetY - newPos[1])]);

    this.setState({projection: projection});
  }


  mouseDown(e) {
    this.dragging = true;
    //Set coords
    this.coords = {
      x: e.pageX,
      y: e.pageY
    }
  }

  mouseUp() {
    this.dragging = false;
    this.coords = {};
  }

  mouseMove(e) {
    //If we are dragging
    if (this.dragging) {
      e.preventDefault();

      //Get mouse change differential
      let xDiff = e.pageX - this.coords.x;
      let yDiff = e.pageY - this.coords.y;

      //Update to our new coordinates
      this.coords.x = e.pageX;
      this.coords.y = e.pageY;

      let projection = this.state.projection;
      let currTranslate = projection.translate();
      projection.translate([currTranslate[0] + xDiff, currTranslate[1] + yDiff]);

      this.setState({projection: projection});
    }

  }

  toggleTracking() {
    if(this.isTracking) {
      clearInterval(this.interval); //stop tracking
    }
    else {
      this.setState({index: 0});
      this.nextIndex(); //start tracking
      this.interval = setInterval(this.nextIndex, 200); //automatically keep increasing the index
    }
    this.isTracking = !this.isTracking; //toggle tracking
  }

  nextIndex() {
    //if we have more truck indecies left
    if(this.state.index < trucks[0].coords.length-1) {
      this.setState({index: this.state.index + 1});
    }
    else {
      clearInterval(this.interval); //stop tracking
      this.isTracking = false;
    }
  }



  render() {
    //Define path generator
    let path = d3.geoPath().projection(this.state.projection);

    return (
      <div id="main">
        <h2>Yemen - Live Tracking - {"Day " + parseInt(this.state.index / steps)}</h2>

        <br/>

        <div ref={this.myContent}>
          <svg width={this.state.width + margin.left + margin.right} height={this.state.height + margin.top + margin.bottom} onWheel={this.zoom} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseMove={this.mouseMove}>
            <g transform={"translate(" + margin.left + "," + margin.top + ")"} >
              {data.features.map((d, i) =>
                <path key={i} className={"country " +d.properties.adm0_a3} d={path(d)}>
                  <title>{"Country: " + d.properties.admin + "\n" + d.properties.type_en + ": " + d.properties.name}</title>
                </path>
              )}



              {trucks.map((t,i) => {
                let currentProjection = this.state.projection([ t.coords[this.state.index].long, t.coords[this.state.index].lat ]);
                return (
                  <g key={i}>
                    {t.coords.slice(0, this.state.index).map((e,j) => {
                      let tmpProjection = this.state.projection([ e.long, e.lat ]);
                      return (<circle key={j} cx={tmpProjection[0]} cy={tmpProjection[1]} fill={t.color} r="2" opacity="0.7"></circle>);
                    })}

                    <circle cx={currentProjection[0]} cy={currentProjection[1]} fill={t.color} r="5" opacity="0.7"></circle>
                  </g>
                );
              })}



              {barcodes.map((b, i) =>
                <g key={i}>
                  {b.slice(0, this.state.index).map((dots,j) =>
                    <g key={j}>
                      {dots.slice(0, this.state.index).map((d,k) => {
                        let tmpProjection = this.state.projection([ d.long, d.lat ]);
                        return (<circle key={k} cx={tmpProjection[0]} cy={tmpProjection[1]} fill="gold" r="2"></circle>);
                      })}
                    </g>
                  )}
                </g>
              )}



              {depots.map((d, i) => {
                let tmpProjection = this.state.projection([ d.long, d.lat ]);

                return (<Depot key={i} transform={"translate("+tmpProjection[0]+","+tmpProjection[1]+")"} rfid={d.rfid[this.state.index]}/>);
              })}
            </g>

            <g transform="translate(20,20)">
              <g><circle cx="0" cy="0" r="7" fill="blue"></circle><text x="15" y="6">Truck with normal behavior</text></g>
              <g transform="translate(0,20)"><circle cx="0" cy="0" r="7" fill="magenta"></circle><text x="15" y="6">Truck with abnormal behavior</text></g>
              <g transform="translate(0,40)"><circle cx="0" cy="0" r="7" fill="green"></circle><text x="15" y="6">RFID Checkpoint</text></g>
              <g transform="translate(0,60)"><circle cx="0" cy="0" r="7" fill="yellow"></circle><text x="15" y="6">QR Code</text></g>
            </g>
          </svg>
        </div>

        <div>
          <button onClick={this.toggleTracking}>Track</button>
        </div>
      </div>
    );
  }
}

export default App;
