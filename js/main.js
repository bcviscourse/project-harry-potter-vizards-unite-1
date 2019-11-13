Promise.all([ 
    d3.csv('/data/mining_algorithms.csv')   
]).then(data=>{ 
    miningData = data
    console.log(miningData);
})