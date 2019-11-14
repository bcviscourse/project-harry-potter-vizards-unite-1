Promise.all([ 
    d3.csv('data/mining_algorithms.csv')   
]).then(data=>{ 
    let miningData = data
    window.miningData = miningData
    console.log(miningData);
})