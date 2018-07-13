function getLeafFragIds( model, leafId ) {
    var instanceTree = model.getData().instanceTree;
    var fragIds = [];

    instanceTree.enumNodeFragments( leafId, function( fragId ) {
        fragIds.push( fragId );
    });

    return fragIds;
}

function getModifiedWorldBoundingBox( fragIds, fragList ) {

    var fragbBox = new THREE.Box3();
    var nodebBox = new THREE.Box3();

    fragIds.forEach( function( fragId ) {
        fragList.getWorldBounds( fragId, fragbBox );

        nodebBox.union( fragbBox );
    });

    return nodebBox;
}

function getComponentBoundingBox( model, dbId) {
    var fragIds = getLeafFragIds( model, dbId );
    var fragList = model.getFragmentList();

    return getModifiedWorldBoundingBox( fragIds, fragList );
}

function getMeshGeometry( data, vertexArray ) {

    var offsets = [{
        count: data.indices.length,
        index: 0,
        start: 0
    }];

    for( let oi = 0, ol = offsets.length; oi < ol; ++oi ) {

        let start = offsets[oi].start;
        let count = offsets[oi].count;
        let index = offsets[oi].index;

        for( let i = start, il = start + count; i < il; i += 3) {

            var a = index + data.indices[i];
            var b = index + data.indices[i + 1];
            var c = index + data.indices[i + 2];

            var vA = new THREE.Vector3();
            var vB = new THREE.Vector3();
            var vC = new THREE.Vector3();

            vA.fromArray( data.positions, a * data.stride );
            vB.fromArray( data.positions, b * data.stride );
            vC.fromArray( data.positions, c * data.stride );

            vertexArray.push( vA );
            vertexArray.push( vB );
            vertexArray.push( vC );
        }
    }
}

function buildComponentMesh( viewer, dbId ) {

    var geometry = getComponentGeometry( viewer, dbId );

    var boundingBox =getComponentBoundingBox( viewer.model, dbId );
    var matrixWorld = geometry.matrixWorld;
    var nbMeshes = geometry.meshes.length;

    var vertexArray = [];

    for( let idx=0; idx < nbMeshes; ++idx ) {
        var mesh = geometry.meshes[idx];

        var meshData = {
            positions: mesh.positions,
            indices: mesh.indices,
            stride: mesh.stride
        };

        getMeshGeometry( meshData, vertexArray );
    }

    var geometry = new THREE.Geometry();

    for( let i = 0; i < vertexArray.length; i += 3 ) {

        geometry.vertices.push( vertexArray[i] );
        geometry.vertices.push( vertexArray[i + 1] );
        geometry.vertices.push( vertexArray[i + 2] );

        var face = new THREE.Face3( i, i + 1, i + 2 );

        geometry.faces.push( face );
    }

    var matrixWorld = new THREE.Matrix4();

    matrixWorld.fromArray( matrixWorld );

    var mesh = new THREE.Mesh( geometry );

    mesh.applyMatrix( matrixWorld );

    mesh.boundingBox = boundingBox;

    mesh.dbId = dbId;

    return mesh;
}
function getComponentGeometry( viewer, dbId ) {

    var fragIds = getLeafFragIds( viewer.model, dbId );

    let matrixWorld = null;

    var meshes = fragIds.map( function( fragId ) {

        var renderProxy = viewer.impl.getRenderProxy( viewer.model, fragId );

        var geometry = renderProxy.geometry;
        var attributes = geometry.attributes;
        var positions = geometry.vb ? geometry.vb : attributes.position.array;

        var indices = attributes.index.array || geometry.ib;
        var stride = geometry.vb ? geometry.vbstride : 3;
        var offsets = geometry.offsets;

        matrixWorld = matrixWorld || renderProxy.matrixWorld.elements;

        return {
            positions,
            indices,
            offsets,
            stride
        };
    });

    return {
        matrixWorld,
        meshes
    };
}
var rsDbids = new Array();

function moveByCondition(dbId,move) {
    var offset = new THREE.Vector3( 0, 0 , move);
    var model = BimBdip.view.model;
    var fragIdsArray = new Array();  // event.fragIdsArray;
    var fargIds = 0;
    var it = BimBdip.view.model.getData().instanceTree;
    //遍历此对象含有的fragment id
    it.enumNodeFragments(dbId, function(fragId) {
        console.log(fragId);
        fragIdsArray.push(fragId);
    },false);


    fragIdsArray.forEach( ( fragId, idx ) => {
        var fragProxy = BimBdip.view.impl.getFragmentProxy( model, fragId );

        fragProxy.getAnimTransform();

        var position = new THREE.Vector3(
            fragProxy.position.x + offset.x,
            fragProxy.position.y + offset.y,
            fragProxy.position.z + offset.z
        );

        fragProxy.position = position;

        fragProxy.updateAnimTransform();
    });

    BimBdip.view.impl.sceneUpdated( true );
}
