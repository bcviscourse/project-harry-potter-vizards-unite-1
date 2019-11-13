Promise.all([ 
    d3.json('/data/mining_algos.csv')   
]).then(data=>{ 
    miningData = data[0]
    console.log(miningData);
})