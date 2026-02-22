import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import * as d3 from 'd3';
import { GraphNode, GraphRelationship } from '../../core/models';

@Component({
  selector: 'app-knowledge-graph',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './knowledge-graph.component.html',
  styleUrls: ['./knowledge-graph.component.scss']
})
export class KnowledgeGraphComponent implements OnInit, AfterViewInit {
  @ViewChild('d3Canvas', { static: false }) canvas!: ElementRef;

  nodes: GraphNode[] = [];
  links: GraphRelationship[] = [];

  stats = { nodes: 0, relationships: 0, diseases: 0, drugs: 0 };

  constructor(private api: ApiService, public toast: ToastService) { }

  ngOnInit(): void {
    this.api.getGraphData().subscribe(data => {
      this.nodes = data.nodes;
      this.links = data.relationships;

      this.stats.nodes = data.nodes.length;
      this.stats.relationships = data.relationships.length;
      this.stats.diseases = data.nodes.filter(n => n.type === 'Disease').length;
      this.stats.drugs = data.nodes.filter(n => n.type === 'Drug').length;

      this.renderGraph();
    });
  }

  ngAfterViewInit(): void {
    this.renderGraph();
  }

  refreshGraph(): void {
    this.toast.success('Cypher query đã thực thi thành công');
    if (!this.canvas) return;
    d3.select(this.canvas.nativeElement).selectAll('*').remove();
    setTimeout(() => this.renderGraph(), 100);
  }

  private renderGraph(): void {
    if (!this.canvas || !this.nodes.length) return;

    d3.select(this.canvas.nativeElement).selectAll('*').remove();

    const width = this.canvas.nativeElement.clientWidth || 800;
    const height = this.canvas.nativeElement.clientHeight || 500;

    const svg = d3.select(this.canvas.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height]);

    // Make deep copies so simulation doesn't mutate our strict references across re-renders
    const nodes = this.nodes.map(d => Object.assign({}, d));
    const links = this.links.map(d => Object.assign({}, d));

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(45));

    const colorMap: Record<string, string> = {
      'Disease': '#ef4444',
      'Symptom': '#f59e0b',
      'Drug': '#10b981',
      'RiskFactor': '#8b5cf6',
      'Patient': '#3b82f6',
      'Doctor': '#06b6d4'
    };

    const iconMap: Record<string, string> = {
      'Disease': '\uf0fd', // stethoscope
      'Symptom': '\uf071', // triangle-exclamation
      'Drug': '\uf46b', // pills
      'RiskFactor': '\uf06d', // fire
      'Patient': '\uf007', // user
      'Doctor': '\uf0f1' // user-doctor
    };

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => (d as any).properties?.severity === 'MAJOR' ? '#ef4444' : '#cbd5e1')
      .attr('stroke-width', d => (d as any).properties?.severity === 'MAJOR' ? 3 : 1.5)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', d => (d as any).properties?.severity === 'MAJOR' ? 'none' : '4 4');

    const linkLabel = svg.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .text(d => (d as any).type)
      .attr('font-size', '8px')
      .attr('fill', '#94a3b8')
      .attr('text-anchor', 'middle');

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', d => d.type === 'Patient' ? 24 : 18)
      .attr('fill', d => colorMap[d.type] || '#cbd5e1')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'grab');

    node.append('text')
      .attr('class', 'fa')
      .text(d => iconMap[d.type] || '\uf111')
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('font-family', '"Font Awesome 6 Free"')
      .attr('font-weight', '900')
      .attr('font-size', '14px')
      .attr('fill', '#fff')
      .style('pointer-events', 'none');

    node.append('text')
      .text(d => d.label)
      .attr('x', 0)
      .attr('y', d => d.type === 'Patient' ? 38 : 32)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#334155')
      .attr('font-weight', '600')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 1px 2px white, 0 -1px 2px white, 1px 0 2px white, -1px 0 2px white');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 4);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }
}
