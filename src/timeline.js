import d3 from 'd3';
import rawData from '../data/data';

const data = rawData.sort((a, b) => new Date(a.start) - new Date(b.start));

export default () => {
  const margins = { top: 20, right: 10, bottom: 0, left: 0 };
  const width = 2160 - margins.right - margins.left;
  const height = 350 - margins.top - margins.bottom;

  const xScale = d3.time.scale()
    // .domain([d3.min(data, d => new Date(d.start)), d3.max(data, d => new Date(d.end))])
    .domain([new Date('1700'), new Date('1830')])
    .range([0, width - margins.left - margins.right]);

  const yScale = d3.scale.ordinal()
    .domain(data.map(d => d.name))
    .rangeBands([0, height], 0.1);

  const zoom = d3.behavior.zoom()
    .x(xScale)
    .scaleExtent([1, 1]);

  const xAxis = d3.svg.axis()
    .orient('top')
    .scale(xScale)
    .tickFormat(d3.time.format('%Y'))
    .ticks(d3.time.year, 5);

  const minorXAxis = d3.svg.axis()
    .orient('top')
    .scale(xScale)
    .tickFormat('')
    .tickSize(height)
    .ticks(d3.time.year, 1);

  const majorXAxis = d3.svg.axis()
    .orient('top')
    .scale(xScale)
    .tickFormat('')
    .tickSize(height)
    .ticks(d3.time.year, 5);

  function drawChart() {
    const chart = d3.select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .call(zoom)
      .append('g')
      .attr('transform', `translate(0, ${margins.top})`);

    chart.append('g')
      .attr('class', 'x axis')
      .call(xAxis);

    chart.append('g')
      .attr('class', 'minor x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(minorXAxis);

    chart.append('g')
      .attr('class', 'major x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(majorXAxis);

    const bar = chart.selectAll('g.entry')
      .data(data).enter()
      .append('g')
      .attr('class', 'entry')
      .attr('transform', d => `translate(0, ${yScale(d.name)})`);

    bar.append('rect')
      .attr('x', d => xScale(new Date(d.start)))
      .attr('height', yScale.rangeBand())
      .attr('class', d => {
        return d.start === d.end ? 'moment' : '';
      })
      .attr('width', d => {
        if (d.start === d.end) {
          return '1px';
        }
        return xScale(new Date(d.end)) - xScale(new Date(d.start));
      });

    bar.append('text')
      .attr('x', d => xScale(new Date(d.start)) + 5)
      .attr('y', yScale.rangeBand() / 2)
      .attr('dy', '.35em')
      .attr('class', d => {
        return d.start === d.end ? 'moment' : '';
      })
      .text(d => {
        if (d.start === d.end) {
          return `${d.name} ${new Date(d.start).getFullYear()}`;
        }
        return `${d.name} ${new Date(d.start).getFullYear()}-${new Date(d.end).getFullYear()}`;
      });
  }

  function zoomed() {
    drawChart();
  }

  zoom.on('zoom', zoomed);

  drawChart();
};
