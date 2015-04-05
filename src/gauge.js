function Gauge(object, config) {
  function extend(dest,options) {
    var i;

    for(i in options) {
      if(options.hasOwnProperty(i) && options[i]!=null) {
        dest[i]=options[i];
      }
    }
    return dest;
  }

  config=extend({
    width:500,
    height:500,
    radius:200,
    minValue:0,
    maxValue:100,
    startAngle:225,
    endAngle:-45,
    sectors:[{
      startAngle:225,
      endAngle:-45
    }]
  },config);

  var C_PI=Math.PI/180;

  function render() {
    var objectContent=object.innerHTML,
      element=document.createElement('DIV'),
      svg=document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      svgNS=svg.namespaceURI,
      sector={
        start:{
          x:Math.cos(config.startAngle*C_PI),
          y:Math.sin(config.startAngle*C_PI)
        },
        end:{
          x:Math.cos(config.endAngle*C_PI),
          y:Math.sin(config.endAngle*C_PI)
        }
      },
      center={
        x:config.width/2,
        //y:Math.abs(config.startAngle-config.endAngle)>180?config.height*(1+Math.min(sector.start.y,sector.end.y)):config.height
        y:config.height/2
      },
      arcPath=document.createElementNS(svgNS,'path'),
      group=document.createElementNS(svgNS,'g'),
      path;
    svg.setAttribute('width',config.width);
    svg.setAttribute('height',config.height);
    element.className='gauge-hide';
    element.innerHTML=objectContent;
    object.innerHTML='';
    //
    path='M'+sector.start.x*config.radius+','+sector.start.y*config.radius;
    path+=' A'+config.radius+','+config.radius+' 0 1,0 '+sector.end.x*config.radius+','+sector.end.y*config.radius;
    arcPath.setAttribute('d',path);
    group.setAttribute('transform','translate('+center.x+','+center.y+')');
    group.appendChild(arcPath);
    svg.appendChild(group);
    //
    object.appendChild(element);
    object.appendChild(svg);
  }

  render();
}