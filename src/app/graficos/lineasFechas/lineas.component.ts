import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { IDatos } from '../lineasFechas/IDatos';
import { curveBundle, curveBasis, curveBasisClosed, curveLinearClosed, curveLinear, bisect, style, curveMonotoneX, curveMonotoneY, curveCardinal } from 'd3';
import { TodoService } from 'src/app/services/todo.service';
import { TodoViewModel } from 'src/app/registros/models/todo-view-model';
import { AuthService } from 'src/app/login/servicios/auth.service';


@Component({
  selector: 'app-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.css']
})
export class LineasFechasComponent implements OnInit {
  emailUser: string;

  constructor(
    private todoService: TodoService,
    private authService: AuthService) { }

  datosMinima: IDatos[] = [];
  datosMaxima: IDatos[] = [];

  ngOnInit() {
    this.buscarUsuario();
  }

  buscarUsuario() {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.emailUser = auth.email;
        console.log(this.emailUser);
        this.loadTodos();
      } else {
        this.emailUser = 'nada';
      }
    });
  }

  loadTodos() {
    this.todoService.getTodos(this.emailUser).subscribe(response => {
      this.datosMinima = [];
      this.datosMaxima = [];
      response.docs.forEach(value => {
        const data = value.data();
        // const id = value.id;
        const desarmado = data.fecha.split('-');
        const anio = desarmado[0];
        let mes = desarmado[1];
        mes = mes - 1;
        const dia = desarmado[2];
        const fechaMinimaMaxima = new Date (anio, mes, dia);
        const valorMinimaModelo: IDatos = {
          fecha: fechaMinimaMaxima,
          valor: data.valorMinima
        };
        this.datosMinima.push(valorMinimaModelo);

        const valorMaximaModelo: IDatos = {
          fecha: fechaMinimaMaxima,
          valor: data.valorMaxima
        };
        this.datosMaxima.push(valorMaximaModelo);
      });
      this.armaGrafico();
    });
  }

  armaGrafico() {
    // Establecemos las dimensiones y los márgenes del gráfico
    const margin = { top: 5, right: 70, bottom: 55, left: 20 },
      width = 700 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // definir la escala en el eje horizontal (X) --------------------------------------------------
    const maxX = (d3.max(this.datosMaxima, d => d.fecha));
    const minX = (d3.min(this.datosMaxima, d => d.fecha));
    const xScale = d3.scaleTime()
      .domain([minX, maxX])
      .range([0, width]);
    // definir el eje X - formatear las fechas ---------------------------------------------------
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%d-%m-%Y--%H:%M.hs'))
      .tickSizeInner(-height);
      // .ticks(10);

    // definir la escala y el eje Y --------------------------------------------------------------------------
    const maxY = (d3.max(this.datosMaxima, d => d.valor));
    const minY = d3.min(this.datosMinima, d => d.valor);
    const yScale = d3.scaleLinear()
      .domain([maxY, minY])
      .range([0, height]);
    const yAxis = d3.axisLeft(yScale)
      .ticks(10)
      .tickSizeInner(-width);
    // definir la escala y el eje Y --------------------------------------------------------------------------


    const svg = d3.select('#lineas').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
    const g = svg.append('g');

    // Añadir los ejes
    // eje X <------------------------------------------------------------------
    g.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
      .call(xAxis)
      .attr('stroke-dasharray', '2,2')
      .attr('stroke-width', 0.3)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.4em')
      .attr('dy', '0em')
      .attr('transform', function (d) {
        return 'rotate(-30)';
      });
      // .append('text')
      // .attr('x', )
      // .attr('dx', '1.0em')
      // .style('text-anchor', 'end')
      // .attr('font-family', 'Arial')
      // .attr('font-size', '12px')
      // .attr('fill', 'black')
      // //.text('Presión arterial (mmHg)');
      // .text('Eje X (fechas)');


    // eje Y <------------------------------------------------------------------
    g.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(yAxis)
      .attr('stroke-dasharray', '2,2')
      .attr('stroke-width', 0.3)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0)
      .attr('dy', '1.00em')
      .style('text-anchor', 'end')
      .attr('font-family', 'Arial')
      .attr('font-size', '12px')
      .attr('fill', 'black')
      // .text('Presión arterial (mmHg)');
      .text('(mmHg)');

    const formatoFechaLocal = d3.timeFormat('%d-%m-%Y');
    const formatAnio = d3.timeFormat('%Y');
    const formatMes = d3.timeFormat('%b');
    const formatDia = d3.timeFormat('%a');
    const formatFecha = d3.timeFormat('%x');

    const tooltip = d3.select('#lineas')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '9999999')
      .style('visibility', 'hidden')
      .style('background', '#e0e0eb')
      .style('padding', '8px')
      .style('border-radius', '5px')
      // .style('border', '2px solid #73AD21')
      .text('Un tooltip simple');


    // <-------------------------------------------------------linea minima-------------------------
    const lineaMinima = d3.line<IDatos>()
      .x((d) => xScale(d.fecha) + margin.left)
      .y((d) => yScale(d.valor) + margin.top)
      .curve(curveCardinal);
      // curveLinear: lineal abierta
      // curveLinearClosed: lineal cerrada
      // curveBasis y curveBasisClosed: Un spline-b c/ptos duplicados en el final
      // curveMonotoneX: genera un spline cubico que pasa por todos los puntos
      // curveCardinal: genera un spline cubico que pasa por todos los ptos. Mas curvada que MonotoneX.
    svg.append('path')
      .data(this.datosMinima)
      // .data(this.todos)
      .attr('d', lineaMinima(this.datosMinima))
      .attr('stroke', '#2eb82e')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .style('opacity', '0.75' )
      .on('mouseover', (d, i, n) => {
        d3.select(n[i])
          .transition()
          .duration(10)
          .style('opacity', '1.00')
          .attr('stroke-width', 4);
        })
      .on('mouseout', (d, i, n) => {
        d3.select(n[i])
          .transition()
          .duration(500)
          .style('opacity', '0.75')
          .attr('stroke-width', 2);
      });
    // <-------------------------------------------------------linea minima-------------------------


    // <-------------------------------------------------------linea maxima-------------------------
    const lineaMaxima = d3.line<IDatos>()
      .x((d) => xScale(d.fecha) + margin.left)
      .y((d) => yScale(d.valor) + margin.top)
      .curve(curveCardinal);

    svg.append('path')
      .data(this.datosMaxima)
      .attr('d', lineaMaxima(this.datosMaxima))
      .attr('stroke', '#2eb82e')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .style('opacity', '0.75' )
      .on('mouseover', (d, i, n) => {
        d3.select(n[i])
          .transition()
          .duration(10)
          .style('opacity', '1.00')
          .attr('stroke-width', 4);
        })
      .on('mouseout', (d , i, n) => {
        d3.select(n[i])
          .transition()
          .duration(500)
          .style('opacity', '0.75')
          .attr('stroke-width', 2);
      });
    // <-------------------------------------------------------linea maxima-------------------------


    // <-------------------------------------------------------circulos minima----------------------
    const circleMinima = svg.append('g')
      .attr('id', 'circulosMinima')
      .selectAll('circles')
      .data(this.datosMinima)
      .enter()
      .append('circle');

    circleMinima
      .attr('cx', d => xScale(d.fecha) + margin.left)
      .attr('cy', d => yScale(d.valor) + margin.top)
      .attr('style', 'fill:#1e7b1e')
      .attr('r', 4)
      .on('mouseover', (d, i, n) => {
        d3.select(n[i])
          .attr('r', () => 8)
          .attr('style', 'fill:red');
        tooltip.text('Fecha: ' + <any>formatoFechaLocal(d.fecha) + ', Valor: ' + <any>d.valor);
        return tooltip.style('visibility', 'visible');
      })
      .on('mousemove', () => {
        return tooltip
          .style('top', (d3.event.pageY - 175) + 'px')
          .style('left', (d3.event.pageX - 200) + 'px');
      })
      .on('mouseout', (d, i, n) => {
        d3.select(n[i])
          .attr('r', 4)
          .attr('style', 'fill:#1e7b1e');
        tooltip
          .style('visibility', 'hidden');
      });
    // <-------------------------------------------------------circulos minima----------------------

    // <-------------------------------------------------------circulos maxima----------------------
    const circleMaxima = svg.append('g')
      .attr('id', 'circulosMaxima')
      .selectAll('circles')
      .data(this.datosMaxima)
      .enter()
      .append('circle');
    circleMaxima
      .attr('cx', d => xScale(d.fecha) + margin.left)
      .attr('cy', d => yScale(d.valor) + margin.top)
      .attr('style', 'fill:#1e7b1e')
      .attr('r', 4)
      .on('mouseover', (d, i, n) => {
        d3.select(n[i])
          .attr('r', () => 8)
          .attr('style', 'fill:red');
        tooltip.text('Fecha: ' + <any>formatoFechaLocal(d.fecha) + ', Valor: ' + <any>d.valor);
        return tooltip.style('visibility', 'visible');
      })
      .on('mousemove', () => {
        return tooltip
          .style('top', (d3.event.pageY - 175) + 'px')
          .style('left', (d3.event.pageX - 200) + 'px');
      })
      .on('mouseout', (d, i, n) => {
        d3.select(n[i])
          .attr('r', 4)
          .attr('style', 'fill:#1e7b1e');
        tooltip
          .style('visibility', 'hidden');
      });
    // <-------------------------------------------------------circulos maxima----------------------

    // titulo
    // const title = svg.append('text')
    //   .attr('x', (width / 2))
    //   .attr('y', 0 - (margin.top))
    //   .attr('text-anchor', 'middle')
    //   .style('font-size', '13px')
    //   .style('text-decoration', 'none');
    // primera linea
    // title.append('tspan')
    //   .attr('x', (width / 2))
    //   .attr('dy', 40)
    //   .text('Presión arterial');
    // segunda linea
    // title.append('tspan')
    //   .attr('x', (width / 2))
    //   .attr('dy', 45)
    //   .text('Disk Space Available');
  }

}
