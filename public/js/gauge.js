function Gauge(object, config) {
  config=extend({
    radius:200,
    padding:40,
    minValue:0,
    maxValue:100,
    startAngle:135,
    endAngle:405,
    ticks:5,
    ticksRadius:210,
    ticksLength:10,
    ticksLabelRadius:230,
    arrowAxisRadius:20,
    arrowRadius:190,
    sectors:[]
  },config);

  var C_PI=Math.PI/180,
    svg=document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    svgNS=svg.namespaceURI,
    objectContent=object.innerHTML,
    width=(Math.max(config.radius,config.ticksRadius,config.ticksLabelRadius,config.arrowRadius)+config.padding)* 2,
    height=width,
    element=document.createElement('DIV'),
    center={
      x:width/2,
      y:height/2
    },
    arcPath,
    i, a, box,
    path;

  element.className='gauge-hide';
  element.innerHTML=objectContent;
  object.innerHTML='';
  object.appendChild(element);
  object.appendChild(svg);

  function getValue() {
    return parseInt(objectContent,10);
  }

  var gauge={
    group:document.createElementNS(svgNS,'g'),
    ticks:getTicks(),
    render:function() {
      svg.setAttribute('class','gauge');
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);

      //Create arc background
      arcPath=createArcPath(config.radius,config.startAngle,config.endAngle,this.group);
      arcPath.setAttribute('class','gauge-line');

      //Create ticks items
      for(i=0;i<this.ticks.length;i++) {
        a=config.startAngle+(config.endAngle-config.startAngle)/(this.ticks.length-1)*i;
        this.ticks[i].labelNode=createTickText(config.ticksLabelRadius,a,this.ticks[i].label,this.group);
        this.ticks[i].tickNode=createTick(config.ticksRadius,config.ticksRadius+config.ticksLength,a,this.group)
      }

      //Render
      this.group.setAttribute('transform','translate('+center.x+','+center.y+')');
      this.group.setAttribute('class','gauge-group');
      svg.appendChild(this.group);

      //Correct tick label position
      for(i=0;i<this.ticks.length;i++) {
        box=this.ticks[i].labelNode.getBBox();
        this.ticks[i].labelNode.setAttribute('dx',-box.width/2);
        this.ticks[i].labelNode.setAttribute('dy',box.height/3);
        this.ticks[i].labelNode.setAttribute('style','');
      }

      //Render sectors
      if(config.sectors.length>0) {
        for(i=0;i<config.sectors.length;i++) {
          arcPath=createArcPath(config.radius,config.sectors[i].startAngle,config.sectors[i].endAngle,this.group);
          arcPath.setAttribute('class','gauge-sector gauge-sector-'+i);
        }
      }
    }
  };

  var arrow={
    group:document.createElementNS(svgNS,'g'),
    arrow:null,
    render:function() {
      createPoint(0,0,config.arrowAxisRadius,this.group);
      this.arrow=document.createElementNS(svgNS,'path');
      this.arrow.setAttribute('d','M0,'+(-config.arrowAxisRadius/2)+' L'+config.arrowRadius+',0 L0,'+config.arrowAxisRadius/2+' z');
      this.group.appendChild(this.arrow);
      //Render
      this.group.setAttribute('transform','translate('+center.x+','+center.y+')');
      this.group.setAttribute('class','gauge-arrow');
      svg.appendChild(this.group);
      this.setValue(getValue());
    },
    setValue:function(value) {
      var distance=config.maxValue-config.minValue;
      var angleDistance=config.endAngle-config.startAngle;
      if(distance==0) return;
      if(angleDistance==0) return;
      if(value===undefined) value=0;
      var angle=config.startAngle+angleDistance*value/distance;
      this.group.setAttribute('transform',' translate('+center.x+','+center.y+') rotate('+angle+')');
    }
  };

  function getTicks() {
    var source=config.ticks, i, result=[];
    if(typeof(config.ticks)=='function') {
      source=config.ticks();
    }
    if(source instanceof Array) {
      for(i=0;i<source.length;i++) {
        if(typeof(source[i])==='string') {
          result.push({
            value:i,
            label:source[i]
          });
        } else {
          result.push(source[i]);
        }
      }
    } else if(typeof(source)=='number' || source instanceof Number) {
      for(i=1; i<=source; i++) {
        result.push({
          value:i,
          label:i
        });
      }
    }
    return result;
  }


  gauge.render();
  arrow.render();

  // Exported functions
  this.setValue=function(value) {
    if(value<config.minValue) value=config.minValue;
    if(value>config.maxValue) value=config.maxValue;

    arrow.setValue(value);
  };

  /* ===================== LIBRARY =========================*/

  function extend(source,options) {
    var i;

    for(i in options) {
      if(options.hasOwnProperty(i) && options[i]!=null) {
        source[i]=options[i];
      }
    }
    return source;
  }

  function createPoint(x,y,r,appendTo) {
    var circle=document.createElementNS(svgNS,'circle');
    circle.setAttribute('cx',x);
    circle.setAttribute('cy',y);
    circle.setAttribute('r',r);
    if(appendTo!=undefined) {
      appendTo.appendChild(circle);
    }
    return circle;
  }

  function createArcPath(r,a,b,appendTo) {
    var s={
        x:Math.cos(a*C_PI)*r,
        y:Math.sin(a*C_PI)*r
      }, e={
        x:Math.cos(b*C_PI)*r,
        y:Math.sin(b*C_PI)*r
      },
      arc=document.createElementNS(svgNS,'path');
    arc.setAttribute('d','M'+s.x+','+s.y+' A'+r+','+r+' 0 '+(b-a>180?1:0)+',1 '+e.x+','+ e.y);
    if(appendTo!=undefined) {
      appendTo.appendChild(arc);
    }
    return arc;
  }

  function createTick(r1,r2,a,appendTo) {
    var s={
        x:Math.cos(a*C_PI)*r1,
        y:Math.sin(a*C_PI)*r1
      }, e={
        x:Math.cos(a*C_PI)*r2,
        y:Math.sin(a*C_PI)*r2
      },
      tick=document.createElementNS(svgNS,'path');
    tick.setAttribute('d','M'+ s.x+','+ s.y+' L'+ e.x+','+ e.y);
    if(appendTo!=undefined) {
      appendTo.appendChild(tick);
    }
    return tick;
  }

  function createTickText(r,a,v,appendTo,config) {
    var text=document.createElementNS(svgNS,'text');
    var c={
      x:Math.cos(a*C_PI)*r,
      y:Math.sin(a*C_PI)*r
    };
    text.appendChild(document.createTextNode(v));
    text.setAttribute('x', c.x);
    text.setAttribute('y', c.y);
    text.setAttribute('style','opacity:0');
    if(appendTo!=undefined) {
      appendTo.appendChild(text);
    }
    return text;
  }
}