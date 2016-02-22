import d3 from 'd3';
import data from './data';

// function differenceInYears(start, end) {
//   // TODO: Make this more precise.
//   const oneMonth = 24 * 60 * 60 * 1000 * 30;
//   return Math.round(Math.abs((new Date(end).getTime() - new Date(start).getTime()) / oneMonth));
// }

export default () => {
  const margins = { top: 20, right: 10, bottom: 0, left: 0 };
  const width = 1160 - margins.right - margins.left;
  const height = 500 - margins.top - margins.bottom;

  const chart = d3.select('.chart')
    .attr('width', width + margins.right + margins.left)
    .attr('height', height + margins.top + margins.bottom)
    .append('g')
    .attr('transform', `translate(0, ${margins.top})`);

  const xScale = d3.time.scale()
    .domain([d3.min(data, d => new Date(d.start)), d3.max(data, d => new Date(d.end))])
    .range([0, width - margins.left - margins.right]);

  const yScale = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.4)
    .domain(data.map(d => d.name));

  const xAxis = d3.svg.axis()
    .orient('top')
    .scale(xScale)
    .tickFormat(d3.time.format('%Y'))
    .ticks(d3.time.year, 2);

  chart.append('g')
    .attr('class', 'x axis')
    .call(xAxis);

  const bar = chart.selectAll('g.entry')
    .data(data).enter()
    .append('g')
    .attr('class', 'entry')
    .attr('transform', (d, i) => `translate(0, ${i * 30})`);

  bar.append('rect')
    .attr('x', d => xScale(new Date(d.start)))
    .attr('height', yScale.rangeBand() / data.length)
    .attr('width', d => xScale(new Date(d.end)) - xScale(new Date(d.start)));

  bar.append('text')
    .attr('x', d => xScale(new Date(d.start)))
    .attr('y', (yScale.rangeBand() / data.length) / 2)
    .attr('dy', '.35em')
    .text(d => `${d.name} ${new Date(d.start).getFullYear()}-${new Date(d.end).getFullYear()}`);
};
