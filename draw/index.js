this.initialize = function() {
  this.drawingObject = undefined;
  this.initialDownPoint = undefined;
  this.previousPoint = undefined;
  console.info(this.id);
  this.downEvent = false;
};

this.down = function( eventData, nodeData, touch ) {
  
  this.downEvent = true;
  var eventPointDown = eventData.stageRelative;
  this.initialDownPoint = eventPointDown;
  var shapeDef = {
      "extends": "http://vwf.example.com/kinetic/line.vwf",
      "properties": {
        "visible": "inherit",
        "opacity": 1,
        "z-index": 4,
        "fill": "blue",
        "x": eventPointDown[ 0 ],
        "y": eventPointDown[ 1 ],
        "position": eventPointDown
      }
  };

  var self = this;
  var name = "freeHand" + this.drawing_index;
  this.drawing_index = this.drawing_index + 1;
  this.baseLayer.lines.children.create( name, shapeDef, function( child ) {
      self.drawingObject = child;
  } );

};

this.move = function( eventData, nodeData, touch ) {
    if ( this.downEvent ) {
      this.update( eventData, nodeData, false );  
    }
};

this.up = function( eventData, nodeData, touch ) {
  this.downEvent = false;
  this.drawingObject = undefined;
  this.initialDownPoint = undefined;
  this.previousPoint = undefined;
};

this.update = function( eventData, nodeData, upEvent ) {
        
  var eventPoint = eventData.stageRelative;
  var pointAccepted = true;

  var diffX = eventPoint[ 0 ] - this.initialDownPoint[ 0 ];
  var diffY = eventPoint[ 1 ] - this.initialDownPoint[ 1 ];
  var pos = [ this.initialDownPoint[ 0 ], this.initialDownPoint[ 1 ] ];
  var width = diffX;  
  var height = diffY;
  var dist = Math.sqrt( ( diffX * diffX ) + ( diffY * diffY ) );

  this.drawingObject.stroke = 'blue';
  this.drawingObject.strokeWidth = 2;

  var posX = eventPoint[ 0 ] - this.drawingObject.x;
  var posY = eventPoint[ 1 ] - this.drawingObject.y;
  
  if ( this.previousPoint === undefined ) {
      if ( Math.abs( posX ) + Math.abs( posY ) > 0 ) {
          this.drawingObject.points = [ 0, 0, posX, posY ];
      } else {
          pointAccepted = false;   
      }
  } else  {
      var dragDiff = [ 
          posX - this.previousPoint[ 0 ], 
          posY - this.previousPoint[ 1 ] 
      ];

      if ( Math.abs( dragDiff[0] ) + Math.abs( dragDiff[1] ) > 0 ) {
          this.drawingObject.points.push( posX );
          this.drawingObject.points.push( posY );                        
      } else {
          pointAccepted = false;    
      }
  }

  if ( pointAccepted ) {
    this.previousPoint = eventPoint;
  }

}; 

this.pointerDown = function( eventData, nodeData ) {
    this.down( eventData, nodeData, false );    
};

this.pointerMove = function( eventData, nodeData ) {
    this.move( eventData, nodeData, false );
};

this.pointerUp = function( eventData, nodeData ) {
    this.up( eventData, nodeData, false );
}; 

this.touchStart = function( eventData, nodeData ) {
    this.down( eventData, nodeData, true );    
};

this.touchMove = function( eventData, nodeData ) {
    this.move( eventData, nodeData, true );
};

this.touchEnd = function( eventData, nodeData ) {
    this.up( eventData, nodeData, true );
};//@ sourceURL=index