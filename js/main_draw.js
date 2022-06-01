//Start IIFE
(function ()
{




//The canvas
let canvasNeuralNetwork = document.getElementById("myCanvas");
//The Rendering Context 
let ctx = canvasNeuralNetwork.getContext("2d");

//DOM Elements
let UIinputLayer = document.getElementById("input-node-input");
let UIoutputLayer = document.getElementById("output-node-input");
let UIhiddenLayer = document.getElementsByClassName("hidden-nodes-input");

//Layers Data
//Data Input Layer - Array of CNeuralNode(s)
let inputLayerNodes = [];
//Data Output Layer - Array of CNeuralNode(s)
let outPutLayerNodes = [];

//Should match number of hidden layers in GUI
let indexOfMultiLayerNodes = [];
//An array of CNeuralNodes
let hiddenMultiLayerNodes = [];

//All Constants
const NODERADIUS = 10;
const NODEDIAMETER = 2 * NODERADIUS;
const OFFSETNODE = 10;

class CNeuralNode 
{
	constructor(pXCenter, pYCenter)
	{
		this.mXCenter = pXCenter;
		this.mYCenter = pYCenter;
	}
}

//-----------------------------------------------------------------------------------------------------------
//-------------------------------           Layers Creation          ----------------------------------------
//-----------------------------------------------------------------------------------------------------------

//Returns a array of CNeuralNode - The input Layer
//pCount is the number of CNeuralNode(s)
function createInputNodes(pCount)
{
	let arrayInputNodes = [];	
	let startXCentrum;
	let startYCentrum;
		
	//if only one node center it in middle
	if (pCount === 1)
	{
		startXCentrum = NODERADIUS;
		startYCentrum = canvasNeuralNetwork.height / 2;
		//Middle Node
		arrayInputNodes.push(new CNeuralNode(startXCentrum + OFFSETNODE, startYCentrum));
	}
	//2 Nodes
	else if (pCount === 2)
	{
		startXCentrum = NODERADIUS;
		startYCentrum = canvasNeuralNetwork.height / 2;
		let offSetY = startYCentrum / 2;

		//Upper Node
		arrayInputNodes.push(new CNeuralNode(startXCentrum + OFFSETNODE, startYCentrum-offSetY));
		//Lower Node
		arrayInputNodes.push(new CNeuralNode(startXCentrum + OFFSETNODE, startYCentrum+offSetY));
	}
	//3 or more nodes
	else 
	{
		//Needs alignment - FIRST offseted node
		let upperInputNodeX = NODERADIUS+OFFSETNODE;
		let upperInputNodeY =  NODERADIUS+OFFSETNODE;		
		arrayInputNodes.push(new CNeuralNode(upperInputNodeX, upperInputNodeY));

		//Calcualte last node - But I insert it in array the last
		var lowerInputNodeX = NODERADIUS+OFFSETNODE;
		var lowerInputNodeY = canvasNeuralNetwork.height-NODERADIUS-OFFSETNODE;			
		
		let middleInputNodesX;
		let middleInputNodesY;

		//If 3 items put one in middle
		if (pCount === 3)
		{	
			//This one is in the middle				
			middleInputNodesX = NODERADIUS+OFFSETNODE;
			middleInputNodesY = canvasNeuralNetwork.height / 2;
			arrayInputNodes.push(new CNeuralNode(middleInputNodesX, middleInputNodesY));
		}
		//If 4 or more devide equal remaining space for 2 nodes
		else //if (pCount === 4)
		{
			let distanceBetweenLastAndFirstNodeEdge = (lowerInputNodeY - upperInputNodeY) - 2*NODERADIUS;
			const MaxNodesFitDraw = Math.floor(distanceBetweenLastAndFirstNodeEdge / (2*NODERADIUS));			

			const ramainingNodesToDraw = pCount-2;			

			let remainingInputNodesX = upperInputNodeX;
			let remainingInputNodesY = upperInputNodeY;
			const totalRemainingSpaceBetweenNodes = distanceBetweenLastAndFirstNodeEdge - ramainingNodesToDraw*NODEDIAMETER;
			const yOffsetBetweenEdgeOfNodes = totalRemainingSpaceBetweenNodes/ (ramainingNodesToDraw+1);
			const yOffsetBetweenCenterYNodes = yOffsetBetweenEdgeOfNodes + NODEDIAMETER;

			for (let i = 1; i <= ramainingNodesToDraw; i++)
			{
				arrayInputNodes.push(new CNeuralNode(remainingInputNodesX,(remainingInputNodesY+i*yOffsetBetweenCenterYNodes)));
			}
		}	
		//Needs alignment - LAST offseted node	 
		arrayInputNodes.push(new CNeuralNode(lowerInputNodeX, lowerInputNodeY));
	}
	return arrayInputNodes
}



//Returns a array of CNeuralNode - The output Layer
//pCount is the number of CNeuralNode(s)
function createOutputNodes(pCount)
{
	let arrayOutputNodes = [];
	let startXCentrum;
	let startYCentrum;

	if (pCount === 1)
	{
		startXCentrum = canvasNeuralNetwork.width - NODERADIUS - OFFSETNODE;
		startYCentrum = canvasNeuralNetwork.height / 2;
		//Middle Node
		arrayOutputNodes.push(new CNeuralNode(startXCentrum, startYCentrum));
	}
	else if (pCount === 2)
	{
		startXCentrum = canvasNeuralNetwork.width - NODERADIUS - OFFSETNODE;
		startYCentrum = canvasNeuralNetwork.height / 2;

		let offSetY = startYCentrum / 2;

		//Upper Node
		arrayOutputNodes.push(new CNeuralNode(startXCentrum, startYCentrum-offSetY));
		//Lower Node
		arrayOutputNodes.push(new CNeuralNode(startXCentrum, startYCentrum+offSetY));
	}
	//3 or More
	else
	{
		//Needs alignment - FIRST offseted node
		let upperInputNodeX = canvasNeuralNetwork.width - NODERADIUS - OFFSETNODE;
		let upperInputNodeY =  NODERADIUS+OFFSETNODE;		
		arrayOutputNodes.push(new CNeuralNode(upperInputNodeX, upperInputNodeY));

		//Calcualte last node - But I insert it in array the last
		var lowerInputNodeX = canvasNeuralNetwork.width - NODERADIUS - OFFSETNODE;
		var lowerInputNodeY = canvasNeuralNetwork.height-NODERADIUS- OFFSETNODE;		

		//2 added lines
		let middleInputNodesX;
		let middleInputNodesY;

		//3 Output nodes
		if (pCount === 3)
		{
			//This one is in the middle				
			middleInputNodesX = canvasNeuralNetwork.width - NODERADIUS - OFFSETNODE;
			middleInputNodesY = canvasNeuralNetwork.height / 2;
			arrayOutputNodes.push(new CNeuralNode(middleInputNodesX, middleInputNodesY));	
		}
		//More than 3
		else
		{
			let distanceBetweenLastAndFirstNodeEdge = (lowerInputNodeY - upperInputNodeY) - 2*NODERADIUS;
			const MaxNodesFitDraw = Math.floor(distanceBetweenLastAndFirstNodeEdge / (2*NODERADIUS));			

			const ramainingNodesToDraw = pCount-2;			

			let remainingInputNodesX = upperInputNodeX;
			let remainingInputNodesY = upperInputNodeY;
			const totalRemainingSpaceBetweenNodes = distanceBetweenLastAndFirstNodeEdge - ramainingNodesToDraw*NODEDIAMETER;
			const yOffsetBetweenEdgeOfNodes = totalRemainingSpaceBetweenNodes/ (ramainingNodesToDraw+1);
			const yOffsetBetweenCenterYNodes = yOffsetBetweenEdgeOfNodes + NODEDIAMETER;

			for (let i = 1; i <= ramainingNodesToDraw; i++)
			{
				arrayOutputNodes.push(new CNeuralNode(remainingInputNodesX,(remainingInputNodesY+i*yOffsetBetweenCenterYNodes)));
			}
		}
		//Needs alignment - LAST offseted node	 
		arrayOutputNodes.push(new CNeuralNode(lowerInputNodeX, lowerInputNodeY));
	}
	return arrayOutputNodes;
}



//Returns a array of CNeuralNode - The middle Layer - Centered Vertical Axis
//pCount is the number of CNeuralNode(s)
function createHiddenMiddleNodes(pCount)
{
	let arrayHiddenNodes = [];
	let startXCentrum;
	let startYCentrum;

	//Only one node
	if (pCount === 1)
	{
		startXCentrum = canvasNeuralNetwork.width / 2;
		startYCentrum = canvasNeuralNetwork.height / 2;
		//Middle Node
		arrayHiddenNodes.push(new CNeuralNode(startXCentrum, startYCentrum));	
	}
	// 2 nodes
	else if (pCount === 2)
	{
		startXCentrum = canvasNeuralNetwork.width / 2;
		startYCentrum = canvasNeuralNetwork.height / 2;

		let offSetY = startYCentrum / 2;

		//Upper Node
		arrayHiddenNodes.push(new CNeuralNode(startXCentrum, startYCentrum-offSetY));
		//Lower Node
		arrayHiddenNodes.push(new CNeuralNode(startXCentrum, startYCentrum+offSetY));
	}
	//3 or more
	else 
	{
		//Needs alignment - FIRST offseted node
		let upperInputNodeX = canvasNeuralNetwork.width / 2;
		let upperInputNodeY =  NODERADIUS+OFFSETNODE;		
		arrayHiddenNodes.push(new CNeuralNode(upperInputNodeX, upperInputNodeY));

		//Calcualte last node - But I insert it in array the last
		var lowerInputNodeX = canvasNeuralNetwork.width / 2;
		var lowerInputNodeY = canvasNeuralNetwork.height-NODERADIUS-OFFSETNODE;
		//Needs alignment - LAST offseted node	 
		arrayHiddenNodes.push(new CNeuralNode(lowerInputNodeX, lowerInputNodeY));	
		
		let middleInputNodesX;
		let middleInputNodesY;
		//Node in the middle
		if (pCount ===3)
		{
			//This one is in the middle				
			middleInputNodesX = canvasNeuralNetwork.width / 2;
			middleInputNodesY = canvasNeuralNetwork.height / 2;
			arrayHiddenNodes.push(new CNeuralNode(middleInputNodesX, middleInputNodesY));
		}
		//4 or More Nodes
		else {
			let distanceBetweenLastAndFirstNodeEdge = (lowerInputNodeY - upperInputNodeY) - 2*NODERADIUS;
			const MaxNodesFitDraw = Math.floor(distanceBetweenLastAndFirstNodeEdge / (2*NODERADIUS));			

			const ramainingNodesToDraw = pCount-2;			

			let remainingInputNodesX = upperInputNodeX;
			let remainingInputNodesY = upperInputNodeY;
			const totalRemainingSpaceBetweenNodes = distanceBetweenLastAndFirstNodeEdge - ramainingNodesToDraw*NODEDIAMETER;
			const yOffsetBetweenEdgeOfNodes = totalRemainingSpaceBetweenNodes/ (ramainingNodesToDraw+1);
			const yOffsetBetweenCenterYNodes = yOffsetBetweenEdgeOfNodes + NODEDIAMETER;

			for (let i = 1; i <= ramainingNodesToDraw; i++)
			{
				arrayHiddenNodes.push(new CNeuralNode(remainingInputNodesX,(remainingInputNodesY+i*yOffsetBetweenCenterYNodes)));
			}
		}
	}
	return arrayHiddenNodes;
}



//Return an array of Layers with CNeural Nodes
//pCount is an array with index of numbers in format [0,1,6,7,12,1,0,2]
function createMultiHiddenLayers(pCount)
{
	//Remove all zeros from pCount
	let arrayWithoutZeroes = pCount.filter(number => number != 0);
	//[0,1,6,7,12,1,0,2] -> [1,6,7,12,1,2]

	let countNodesInLayers = arrayWithoutZeroes;
	const countHiddenLayers = countNodesInLayers.length;
	
	//The new array with all the CNeuralNode(s)
	var arrayMultiHiddenLayers = [];

	//Create nodes in each hidden layer
	for (let i = 0; i < countNodesInLayers.length; i++)
	{
		arrayMultiHiddenLayers.push(createHiddenMiddleNodes(countNodesInLayers[i]));	
	}
		
	//IMPORTANT that order so node with lowest mxCenter is lowest index number IMPORTANT
	//If only one layer dont do nothing, its already aligned
	if (countHiddenLayers === 1)
	{

	}
	//If 2 or more layer split it uniformly
	else
	{
		let xEdgeDistanceBetweenOutputNodeAndInputNode =  (outPutLayerNodes[0].mXCenter -NODERADIUS) - (inputLayerNodes[0].mXCenter + NODERADIUS);
		let xTotalRemainingSpaceAfterNodeSubtract = xEdgeDistanceBetweenOutputNodeAndInputNode - (countHiddenLayers*NODEDIAMETER);
		let xEqualSpaceLeftBetweenNodes = xTotalRemainingSpaceAfterNodeSubtract / (countHiddenLayers+1);

		let xOffsetBetweenNodes = xEqualSpaceLeftBetweenNodes + NODEDIAMETER;

		//Lets align them now :D
		//Lets do it manually
		for (let i = 0; i < countHiddenLayers; i++)
		{
			for (let j = 0; j < countNodesInLayers[i]; j++)
			{				
				arrayMultiHiddenLayers[i][j].mXCenter = (inputLayerNodes[0].mXCenter + ((i+1)*xOffsetBetweenNodes));
			}	
		}
	}
	return arrayMultiHiddenLayers;
}





//-----------------------------------------------------------------------------------------------------------
//-------------------------------           Drawing          ----------------------------------------
//-----------------------------------------------------------------------------------------------------------

function drawInputNodes()
{
	//Set color on nodes
	ctx.fillStyle = "rgb(0, 0, 255)";
	//Prepare to paint
	ctx.beginPath();

	//Draw the nodes
	for (let i = 0; i < inputLayerNodes.length; i++)
	{
		//ctx.arc(arrayInputNodes[i].mXPos, arrayInputNodes[i].mYPos, NODERADIUS, 0, 2* Math.PI , false);
		//ctx.stroke();	
		ctx.moveTo(inputLayerNodes[i].mXCenter, inputLayerNodes[i].mYCenter);
		ctx.arc(inputLayerNodes[i].mXCenter, inputLayerNodes[i].mYCenter, NODERADIUS, 0, 2* Math.PI , false);
		ctx.fill();
	}
	//End painting
	ctx.closePath();
}



function drawOutputNodes()
{
	//Set color on nodes
	ctx.fillStyle = "rgb(255, 0, 0)";
	//Prepare to paint
	ctx.beginPath();
	
	//Draw the nodes
	for (let i = 0; i < outPutLayerNodes.length; i++)
	{
		//Move Pencil to avoid fill in between
		ctx.moveTo(outPutLayerNodes[i].mXCenter, outPutLayerNodes[i].mYCenter);
		ctx.arc(outPutLayerNodes[i].mXCenter, outPutLayerNodes[i].mYCenter, NODERADIUS, 0, 2* Math.PI , false);
		ctx.fill();		
	}	
	//End painting
	ctx.closePath();	
}



//Draw ALL nodes in ALL Hidden LAyers
function drawMultiHiddenLayers()
{
	//Set color on nodes
	ctx.fillStyle = "rgb(0, 255, 0)";
	
	//Prepare to paint
	ctx.beginPath();

	//Loops how many times middle layer is present
	for (let i = 0; i < hiddenMultiLayerNodes.length; i++)
	{
		for (let j = 0; j  <hiddenMultiLayerNodes[i].length; j++)
		{
			ctx.moveTo(hiddenMultiLayerNodes[i][j].mXCenter, hiddenMultiLayerNodes[i][j].mYCenter, NODERADIUS, 0, 2* Math.PI , false);
			ctx.arc(hiddenMultiLayerNodes[i][j].mXCenter, hiddenMultiLayerNodes[i][j].mYCenter, NODERADIUS, 0, 2* Math.PI , false);
			ctx.fill();
		}
	}
	//End paiting
	ctx.closePath();
}



function drawLinesBetweenTwoLayers(pLayerLeftSide, pLayerRightSide)
{	
	ctx.beginPath();
	for (let i = 0; i < pLayerLeftSide.length; i++)
	{
		for (let j = 0; j < pLayerRightSide.length; j++)
		{
			ctx.moveTo(pLayerLeftSide[i].mXCenter, pLayerLeftSide[i].mYCenter);
			ctx.lineTo(pLayerRightSide[j].mXCenter, pLayerRightSide[j].mYCenter);
		}
	}	
	ctx.closePath();
	ctx.stroke();		
}



function drawAllLinesBetweenNodes()
{	
	//Draw between input layer and "First" hidden layer
	drawLinesBetweenTwoLayers(inputLayerNodes, hiddenMultiLayerNodes[0]);
	
	//Draw all "internal hidden" layers
	for (let i = 0; i < (hiddenMultiLayerNodes.length -1); i++ )
	{
		drawLinesBetweenTwoLayers(hiddenMultiLayerNodes[i], hiddenMultiLayerNodes[i+1]);
	}
		
	//Draw last line between "last hidden layer" and output layer
	drawLinesBetweenTwoLayers(hiddenMultiLayerNodes[hiddenMultiLayerNodes.length-1], outPutLayerNodes);
}



function emptyCanvasDrawing()
{
	ctx.clearRect(0,0, canvasNeuralNetwork.width, canvasNeuralNetwork.height);
}



function drawAll()
{
	//First Layer
	drawInputNodes();

	//All hidden layer(s)
	drawMultiHiddenLayers();

	//Last layer 
	drawOutputNodes();

	//Draw lines between nodes
	drawAllLinesBetweenNodes();
}





//-----------------------------------------------------------------------------------------------------------
//-------------------------------           Event Handlers          -----------------------------------------
//-----------------------------------------------------------------------------------------------------------

function setupAllEventListeners()
{
	//For Input Layer
	UIinputLayer.addEventListener('input', function(pEventObject) 
		{
			let countInputNodes = pEventObject.target.value;
			//Empty string
			if (countInputNodes === "")
			{
				console.log("Error input from gui component at for InputLayer. Value is:  " + countInputNodes);
				console.log("Defaulting to 1");
				countInputNodes  = 1;
			}
			//We know its a number	
			else
			{
				countInputNodes = parseInt(pEventObject.target.value);

				//Lock to max 15 Nodes because of GUI, NOTE program is able to handle MUCH more CNeural Nodes
				if (countInputNodes > 15)
				{
					//This generates a Visual BUG, input element show more than 15 Nodes, but only draws 15 CNodes
					//Input element dont update UI properly when changing value through setAttribute/getAttribute/has attribute
					//Considering changing to a Drop Down Menu - Await user response
					countInputNodes = 15;										
				}
			}
			inputLayerNodes = createInputNodes(countInputNodes);
			emptyCanvasDrawing();
			drawAll();
		}
	);

	//For Output Layer
	UIoutputLayer.addEventListener('input', function(pEventObject) 
		{
			let countOutputNodes = pEventObject.target.value;
			//Empty string
			if (countOutputNodes === "")
			{
				console.log("Error input from gui component at for Output Layer. Value is:  " + countOutputNodes);
				console.log("Defaulting to 1");
				countOutputNodes  = 1;
			}
			//We know its a number	
			else
			{
				countOutputNodes = parseInt(pEventObject.target.value);

				//Lock to max 15 Nodes because of GUI, NOTE program is able to handle MUCH more CNeural Nodes
				if (countOutputNodes > 15)
				{
					//This generates a Visual BUG, input element show more than 15 Nodes, but only draws 15 CNodes
					//Input element dont update UI properly when changing value through setAttribute/getAttribute/has attribute
					//Considering changing to a Drop Down Menu - Await user response
					countOutputNodes = 15;										
				}
			}
			outPutLayerNodes = createOutputNodes(countOutputNodes);
			emptyCanvasDrawing();
			drawAll();
		}
	);

	for (let i = 0; i < UIhiddenLayer.length; i++)
	{
		//For ALL hidden layers
		UIhiddenLayer[i].addEventListener('input', function(event)
		{
			sharedHiddenInputListener(event, i);			
		}
		);		
	}
}



//Every "hidden layer" input event generated, separated by pIndex 0...7
function sharedHiddenInputListener(pEventObject, pIndex)
{
	let countNodesCurrentLayer = pEventObject.target.value;
	if (countNodesCurrentLayer === "")
	{
		console.log("Error input from gui component Hidden Layer at index: " + pIndex);
		console.log("Value is: " + countNodesCurrentLayer);
		//First Hidden layer, set it to placeholder value, this case 1
		if (pIndex === 0)
		{			
			console.log("Error input from gui component at HiddenLayer. Value is:" + countNodesCurrentLayer);
			console.log("At index: " + pIndex);
			console.log("Defaulting to 1");
			countNodesCurrentLayer = 1;
		}
		//Every else hidden layer - setting to 0
		else 
		{			
			console.log("Error input from gui component at HiddenLayer. Value is:" + countNodesCurrentLayer);
			console.log("At index: " + pIndex);
			console.log("Defaulting to 0");
			countNodesCurrentLayer = 0;
		}
		//Set to default value
		indexOfMultiLayerNodes[pIndex] = countNodesCurrentLayer;		
	}
	//We know its a number	
	else
	{			
		countNodesCurrentLayer = parseInt(pEventObject.target.value);
		
		//Lock to max 15 Nodes because of GUI, NOTE program is able to handle MUCH more CNeural Nodes
		if (countNodesCurrentLayer > 15)
		{
			//This generates a Visual BUG, input element show more than 15 Nodes, but only draws 15 CNodes
			//Input element dont update UI properly when changing value through setAttribute/getAttribute/has attribute
			//Considering changing to a Drop Down Menu - Await user response
			countNodesCurrentLayer = 15;
		}

		//Set value to corresponding index	
		indexOfMultiLayerNodes[pIndex] = countNodesCurrentLayer;				
	}
	//Replace with new data	
	hiddenMultiLayerNodes = createMultiHiddenLayers(indexOfMultiLayerNodes)
	emptyCanvasDrawing();
	drawAll();
}





//-----------------------------------------------------------------------------------------------------------
//-------------------------------           SET UP          -------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

function resetAllDataDefault()
{
	inputLayerNodes = [];
	outPutLayerNodes = [];
	indexOfMultiLayerNodes = [];
	hiddenMultiLayerNodes = [];
}



//Change here if another init value is desired
function init()
{
	resetAllDataDefault();

	const numberOfInputNodes = 1;
	const numberOfOutputNodes = 1;

	//Data for input nodes - Input Layer
	inputLayerNodes = createInputNodes(numberOfInputNodes);

	//Data for ouput nodes - Output Layer	
	outPutLayerNodes = createOutputNodes(numberOfOutputNodes);	
	
	//indexOfMultiLayerNodes = [1, 0 ,4, 7, 0, 12, 7, 8, 12, 1, 5, 13, 11, 3, 1, 5];
	//An array of indexes of nodes in format [1, 0 ,4, 7, 0, 12, 7, 8], change below for another init setup. PS MAX 8 Hidden layers for this GUI
	indexOfMultiLayerNodes = [1, 1, 1, 1, 1, 1, 1, 1];
	//An array of CNeuralNodes
	hiddenMultiLayerNodes = createMultiHiddenLayers(indexOfMultiLayerNodes);
}



//Run with an IFFI
init()
drawAll();
setupAllEventListeners();





//IIFE END	
})();
