(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{240:function(e,t,a){},241:function(e,t,a){},242:function(e,t,a){},74:function(e,t,a){e.exports=a(75)},75:function(e,t,a){"use strict";a.r(t);var n=a(73),r=a(11),o=a.n(r),s=a(29),i=a(30),l=a(44),c=a(32),u=a(31),d=a(33),p=a(0),m=a.n(p),h=a(43),g=a.n(h),b=a(69),f=a(4),v=a.n(f),y=a(45),E=a(71),C=a.n(E),O=a(72),N=a.n(O),S=(a(240),a(241),a(242),a(243),{datasets:[{spanGaps:!1,showLine:!0,label:"Datapoints",fill:!0,lineTension:.1,backgroundColor:"rgba(75,192,192,0.4)",borderColor:"rgba(75,192,192,1)",borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",pointBorderColor:"rgba(75,192,192,1)",pointBackgroundColor:"#fff",pointBorderWidth:1,pointHoverRadius:5,pointHoverBackgroundColor:"rgba(75,192,192,1)",pointHoverBorderColor:"rgba(220,220,220,1)",pointHoverBorderWidth:2,pointRadius:1,pointHitRadius:10,data:[]}]}),T=function(e){return e.current?{query:{filter:{propertyFilter:{op:"GREATER_THAN_OR_EQUAL",property:{name:"published_at"},value:{stringValue:e.startTime.toISOString()}}},kind:[{name:"ParticleEvent"}],projection:[{property:{name:"data"}},{property:{name:"published_at"}}]}}:{query:{filter:{compositeFilter:{filters:[{propertyFilter:{op:"GREATER_THAN_OR_EQUAL",property:{name:"published_at"},value:{stringValue:e.startTime.toISOString()}}},{propertyFilter:{op:"LESS_THAN_OR_EQUAL",property:{name:"published_at"},value:{stringValue:e.endTime.toISOString()}}}],op:"AND"}},kind:[{name:"ParticleEvent"}],projection:[{property:{name:"data"}},{property:{name:"published_at"}}]}}},j={Today:v()(),Yesterday:v()().subtract(1,"days")},k=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).handleChangeStart=function(e){a.setState({startTime:e})},a.handleChangeEnd=function(e){a.setState({endTime:e})},a.handleCurrent=function(e){e.target.checked?(a.setState({current:!0,endTime:null}),a.intervalHandler()):(clearTimeout(a.timeout),a.setState({current:!1}),a.handleChangeEnd(v()()))},a.intervalHandler=Object(s.a)(o.a.mark(function e(){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.getData();case 2:console.log("get data done, resetting"),a.state.current&&(a.timeout=setTimeout(a.intervalHandler,2e3));case 4:case"end":return e.stop()}},e,this)})),a.getDataHandler=Object(s.a)(o.a.mark(function e(){var t;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=T(a.state),null!==a.lastCursor&&(t.query.startCursor=a.lastCursor),e.next=4,fetch("https://datastore.googleapis.com/v1/projects/ubc-supermileage-telemetry-v2:runQuery?prettyPrint=true&alt=json",{method:"POST",headers:{Authorization:"Bearer "+a.token,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)}).then(function(e){return e.json().then(function(e){console.log(e);try{if("entityResults"in e.batch?(console.log(),null===a.lastCursor?a.vals=[]:a.vals=a.vals.slice(),e.batch.entityResults.forEach(function(e){var t={};t.y=parseFloat(e.entity.properties.data.stringValue),t.x=v()(e.entity.properties.published_at.stringValue),a.vals.length>0&&t.x.unix()-v()(a.vals[a.vals.length-1].x).unix()>600&&a.vals.push({y:NaN,x:t.x}),a.vals.push(t)})):a.vals=[],"NOT_FINISHED"===e.batch.moreResults)return console.log("Not done"),a.lastCursor=e.batch.endCursor,a.getDataHandler()}catch(t){console.log(t)}return console.log("Done"),a.lastCursor=null,!0})});case 4:case"end":return e.stop()}},e,this)})),a.getData=Object(s.a)(o.a.mark(function e(){var t;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a.setState({updating:!0}),e.next=3,a.getDataHandler();case 3:console.log("data handling done"),t=Object(n.a)({},a.state.graph.datasets[0],{data:a.vals}),a.setState({graph:{datasets:[t]},updating:!1});case 6:case"end":return e.stop()}},e,this)})),a.responseGoogle=function(e){a.setState({loggedIn:!0}),console.log(e),console.log("Success"),a.token=e.accessToken},a.responseFail=function(e){console.log(e),console.log("Failed")},a.buttonProvider=function(){return a.state.current?m.a.createElement("button",{className:"button is-rounded is-info is-small is-loading",onClick:a.getData,disabled:!0},"Update"):a.state.updating?m.a.createElement("button",{className:"button is-rounded is-info is-small is-loading",onClick:a.getData,disabled:!0},"Update"):m.a.createElement("button",{className:"button is-rounded is-info is-small",onClick:a.getData},"Update")},a.infoHide=function(){a.setState({infoOn:!1})},a.lastCursor=null,a.vals=[],a.state={startTime:v()(),endTime:v()(),current:!1,loggedIn:!1,graph:S,animations:!0,updating:!1,infoOn:!0},a}return Object(d.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=m.a.createElement("div",{className:"container"},m.a.createElement("div",{className:"notification is-info"},"Welcome! If it's your first time here, the toggle sets whether the data is updated live. Otherwise, you can grab specific data by selecting your time range, then pressing \"Update\". You may encounter errors if you're not authorized to access the datastore. You can close this message on the top right.",m.a.createElement("button",{onClick:this.infoHide,className:"delete"})));return this.state.loggedIn?m.a.createElement("div",null,this.state.infoOn?e:void 0,m.a.createElement("div",{className:"container notification"},m.a.createElement("div",{className:"columns"},m.a.createElement("div",{className:"column is-narrow"},m.a.createElement(w,{startVal:this.state.startTime,endVal:this.state.endTime,onChangeStart:this.handleChangeStart,onChangeEnd:this.handleChangeEnd})),m.a.createElement("div",{className:"column"},m.a.createElement("div",{className:"columns is-mobile"},m.a.createElement("div",{className:"toggle column is-narrow"},m.a.createElement(C.a,{defaultChecked:this.state.current,onChange:this.handleCurrent})),m.a.createElement("div",{className:"column is-narrow"},this.buttonProvider()))))),m.a.createElement("div",{className:"container notification has-background-white-bis"},m.a.createElement(H,{data:this.state.graph,animations:this.state.animations}))):m.a.createElement("div",null,m.a.createElement("div",{className:"container notification is-link floater"},"To get started, log in to generate an OAuth token."),m.a.createElement("div",{className:"login"},m.a.createElement(N.a,{clientId:"617338661646-v92ol8vhd4nl44vpntkv4jpjbq5hahmo.apps.googleusercontent.com",buttonText:"Login",onSuccess:this.responseGoogle,onFailure:this.responseFail})))}}]),t}(m.a.Component),H=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).render=function(){return m.a.createElement("div",null,m.a.createElement(b.a,{data:a.props.data,options:{animation:!!a.props.animations&&{duration:500},scales:{xAxes:[{gridLines:{display:!1},type:"time",distribution:"linear",scaleLabel:{display:!0,labelString:"Time"}}],yAxes:[{gridLines:{display:!1},scaleLabel:{display:!0,labelString:"Velocity"}}]}}}))},a}return Object(d.a)(t,e),t}(m.a.Component),w=function(e){function t(){return Object(i.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return m.a.createElement("div",{className:"columns"},m.a.createElement("div",{className:"column"},m.a.createElement(y.DatetimePickerTrigger,{className:"input is-rounded is-small",shortcuts:j,moment:this.props.startVal,onChange:this.props.onChangeStart},m.a.createElement("input",{type:"text",value:this.props.startVal.format("YYYY-MM-DD HH:mm"),readOnly:!0}))),m.a.createElement("div",{className:"column"},m.a.createElement(y.DatetimePickerTrigger,{className:"input is-rounded is-small",shortcuts:j,moment:this.props.endVal,onChange:this.props.onChangeEnd,disabled:null===this.props.endVal},m.a.createElement("input",{type:"text",value:null===this.props.endVal?"Current":this.props.endVal.format("YYYY-MM-DD HH:mm"),readOnly:!0,disabled:null===this.props.endVal}))))}}]),t}(m.a.Component);g.a.render(m.a.createElement(k,null),document.getElementById("root"))}},[[74,1,2]]]);
//# sourceMappingURL=main.02d7fd1e.chunk.js.map