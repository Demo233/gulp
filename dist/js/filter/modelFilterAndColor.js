"use strict";function getLeafFragIds(e,n){var t=e.getData().instanceTree,r=[];return t.enumNodeFragments(n,function(e){r.push(e)}),r}function getModifiedWorldBoundingBox(e,n){var t=new THREE.Box3,r=new THREE.Box3;return e.forEach(function(e){n.getWorldBounds(e,t),r.union(t)}),r}function getComponentBoundingBox(e,n){return getModifiedWorldBoundingBox(getLeafFragIds(e,n),e.getFragmentList())}function getMeshGeometry(e,n){for(var t=[{count:e.indices.length,index:0,start:0}],r=0,o=t.length;r<o;++r)for(var i=t[r].start,s=t[r].count,a=t[r].index,d=i,m=i+s;d<m;d+=3){var u=a+e.indices[d],c=a+e.indices[d+1],p=a+e.indices[d+2],g=new THREE.Vector3,f=new THREE.Vector3,v=new THREE.Vector3;g.fromArray(e.positions,u*e.stride),f.fromArray(e.positions,c*e.stride),v.fromArray(e.positions,p*e.stride),n.push(g),n.push(f),n.push(v)}}function buildComponentMesh(e,n){for(var t=getComponentGeometry(e,n),r=getComponentBoundingBox(e.model,n),o=t.matrixWorld,i=t.meshes.length,s=[],a=0;a<i;++a){getMeshGeometry({positions:(u=t.meshes[a]).positions,indices:u.indices,stride:u.stride},s)}t=new THREE.Geometry;for(var d=0;d<s.length;d+=3){t.vertices.push(s[d]),t.vertices.push(s[d+1]),t.vertices.push(s[d+2]);var m=new THREE.Face3(d,d+1,d+2);t.faces.push(m)}var u;return(o=new THREE.Matrix4).fromArray(o),(u=new THREE.Mesh(t)).applyMatrix(o),u.boundingBox=r,u.dbId=n,u}function getComponentGeometry(d,e){var n=getLeafFragIds(d.model,e),m=null,t=n.map(function(e){var n=d.impl.getRenderProxy(d.model,e),t=n.geometry,r=t.attributes,o=t.vb?t.vb:r.position.array,i=r.index.array||t.ib,s=t.vb?t.vbstride:3,a=t.offsets;return m=m||n.matrixWorld.elements,{positions:o,indices:i,offsets:a,stride:s}});return{matrixWorld:m,meshes:t}}var rsDbids=new Array;function moveByCondition(e,n){var o=new THREE.Vector3(0,0,n),i=BimBdip.view.model,t=new Array;BimBdip.view.model.getData().instanceTree.enumNodeFragments(e,function(e){t.push(e)},!1),t.forEach(function(e,n){var t=BimBdip.view.impl.getFragmentProxy(i,e);t.getAnimTransform();var r=new THREE.Vector3(t.position.x+o.x,t.position.y+o.y,t.position.z+o.z);t.position=r,t.updateAnimTransform()}),BimBdip.view.impl.sceneUpdated(!0)}