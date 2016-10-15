
var _svg1;
var _frameRate1;

function init()
{
	_svg1=new customSVG('svg1');
/*
	_svg1.addElement(new customElement(299,0,0,0,'wall',[Math.PI/2]));
	_svg1.addElement(new customElement(599,299,0,0,'wall', [Math.PI]));
	_svg1.addElement(new customElement(299,599,0,0,'wall',[3*Math.PI/2]));
	_svg1.addElement(new customElement(0,299,0,0,'wall',[0]));
*/
	_svg1.addElement(new customElement(500,51,150,0.1,'ball', [50,'#ccc']));
	_svg1.addElement(new customElement(200,200,200,4.5*Math.PI/4,'ball',[50,'#777']));
/*
	_svg1.addElement(new customElement(150,51,40,3*Math.PI/4,'ball',[50,'#555']));
	_svg1.addElement(new customElement(300,51,15,0,'ball', [50,'#ccc']));
	_svg1.addElement(new customElement(150,351,35,4*Math.PI/4,'ball',[50,'#777']));
	_svg1.addElement(new customElement(300,351,45,3.5*Math.PI/4,'ball',[50,'#555']));
*/
	_frameRate1=new frameRate();

	anim((new Date()).getTime()/1000);
}

function anim(time1)
{
	var time2=(new Date()).getTime()/1000;
	var time=time2-time1;
	console.log('frame');
	_svg1.update(time);
	_frameRate1.update(time);

	_svg1.elementsDistance(time);
	_svg1.elementsEdges(time);
	window.requestAnimationFrame(function(){anim(time2);});
}

function customSVG(id)
{
	this.id=id;
	this.elements=new Array();

	this.svg=document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	this.svg.id=id;
	this.svg.setAttribute('width',600);
	this.svg.setAttribute('height',600);
	this.svg.setAttribute('style','background:#e0e0e0;');

	document.body.appendChild(this.svg);

	this.addElement = function(element)
	{
		this.elements.push(element);
		element.addSVG(this);
	}

	this.update = function(time)
	{
		for (var i=0; i<this.elements.length; i++)
		{
			this.elements[i].move(time);
		}
	}

	this.elementsDistance = function(time)
	{
		var l=1,i,j,x1,x2,y1,y2;

		for (j=0; j<this.elements.length-1;j++)
		{
			x1=this.elements[j].x;
			y1=this.elements[j].y;

			for (i=l; i<this.elements.length; i++)
			{
				x2=this.elements[i].x;
				y2=this.elements[i].y;

				var d1=Math.atan2((y2-y1),(x2-x1))
				var d2=Math.atan2((y1-y2),(x1-x2))

				if (this.distance(this.elements[j].getEdge(d1),this.elements[i].getEdge(d2))<1)
				{
					console.log('collision');
					collision(time,this.elements[j],Math.atan((y2-y1)/(x2-x1)));
					collision(time,this.elements[i],Math.atan((y1-y2)/(x1-x2)));
				}
			}
			l++;
		}
	}

	this.elementsEdges = function(time)
	{
		for (i=0; i<this.elements.length; i++)
		{
			if (this.elements[i].x<=this.elements[i].r)
			{
				this.elements[i].x=this.elements[i].r;
				collision(time,this.elements[i],0);
			}
			if (this.elements[i].x>=this.svg.getAttribute('width')-1-this.elements[i].r)
			{
				this.elements[i].x=this.svg.getAttribute('width')-1-this.elements[i].r;
				collision(time,this.elements[i],Math.PI);
			}
			if (this.elements[i].y<=this.elements[i].r)
			{
				this.elements[i].y=this.elements[i].r;
				collision(time,this.elements[i],Math.PI/2);
			}
			if (this.elements[i].y>=this.svg.getAttribute('height')-1-this.elements[i].r)
			{
				this.elements[i].y=this.svg.getAttribute('height')-1-this.elements[i].r;
				collision(time,this.elements[i],3*Math.PI/2);
			}
		}
	}

	this.distance = function(p1,p2)
	{
		try
			{
				var x1=p1[0];
				var y1=p1[1];
				var x2=p2[0];
				var y2=p2[1];
				console.log('Distance '+Math.sqrt(Math.pow(y2-y1,2)+Math.pow(x2-x1,2)));
				return Math.sqrt(Math.pow(y2-y1,2)+Math.pow(x2-x1,2));
			}
			catch(e)
			{
				console.log('false');
				return false;
			}
	}
}

function customElement(x,y,v,d,type,properties)
{
	this.x=x;
	this.y=y;
	this.v=v; // pixels/s
	this.vo=v;
	this.d=d; // rad
	this.pause=0;
	this.svg;
	this.type;

	switch (type)
	{
		case 'ball':

		this.type=0;
		this.r=properties[0];
		this.c=properties[1];
		this.svg=document.createElementNS('http://www.w3.org/2000/svg', 'circle');

		this.svg.setAttribute('cx',this.x);
		this.svg.setAttribute('cy',this.y);
		this.svg.setAttribute('r',this.r);
		this.svg.setAttribute('fill',this.c);

		break;

		case 'wall':

		this.type=1;
		this.n=properties[0];

		break;
	}

	this.addSVG = function(p)
	{
		if (this.svg)
		{
			p.svg.appendChild(this.svg);
		}
	}

	this.move = function(time)
	{
		this.x+=this.v*time*Math.cos(this.d);
		this.y+=this.v*time*Math.sin(this.d);

		if (this.svg)
		{
			this.svg.setAttribute('cx',this.x);
			this.svg.setAttribute('cy',this.y);
		}
	}

	this.getEdge = function(d)
	{
		switch (this.type)
		{
			case 0:
			console.log('c: '+this.c);
			console.log('d: '+d);
			console.log('pos: '+this.x+' '+this.y);
			console.log('edge: '+(this.x+this.r*Math.cos(d))+' '+(this.y+this.r*Math.sin(d)));
			return [(this.x+this.r*Math.cos(d)),(this.y+this.r*Math.sin(d))];
			break;

			case 1:

			break;
		}
	}
}

function frameRate()
{
	this.element=document.createElement('div');
	document.body.appendChild(this.element);
	this.element.style='position:absolute;right:10;top:10;';

	var updateFrequency=0.2;
	var cumulativeTime=0;
	var count=0;

	this.update = function(time)
	{
		cumulativeTime+=time;
		count++;

		if(cumulativeTime>updateFrequency)
		{
			this.element.innerHTML=Math.round(count/cumulativeTime);
			cumulativeTime=0;
			count=0;
		}
	}
}

function collision(time,e,n)
{
	e.v=0;
	e.pause+=time;

	if (e.pause>=0)
	{
		e.v=e.vo;

		e.d=n+(n-(e.d+Math.PI));
		e.d=e.d%(2*Math.PI);
		e.pause=0;
	}
}
