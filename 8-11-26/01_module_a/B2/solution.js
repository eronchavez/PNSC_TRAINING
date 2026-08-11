// Place your solution here



// function longestStableWindow(a, limit)
// {
//   let max = [], min = [], l = 0, best = 0;

//   for(let r = 0; r < a.length; r++)
//   {
//     while(max.length && a[max.at(-1)] <= a[r]) max.pop();
//     while(min.length && a[min.at(-1)] >= a[r]) min.pop();
//     max.push(r);
//     min.push(r);

//     while(a[max[0]] - a[min[0]] > limit )
//     {
//       if(max[0] === l) max.shift();
//       if(min[0] === l) min.shift();
//       l++;
//     }

//      best = Math.max(best, r - l + 1);
//   }

//   return best;

// }

function longestStableWindow(a, limit)
{
  let max = [], min = [], l = 0, best = 0;
  for(let r = 0; r < a.length; r++)
  {
    while(max.length && a[max.at(-1)] <= a[r] ) max.pop();
    while(min.length && a[min.at(-1)] >= a[r]) min.pop();
    max.push(r);
    min.push(r);

    while(a[max[0]] - a[min[0]] > limit)
    {
      if(max[0] === l) max.shift();
      if(min[0] === l) min.shift();
      l++;
    }

    best = Math.max(best, r - l + 1);
  }

  return best;
}