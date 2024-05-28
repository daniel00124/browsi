import { Component, Input, OnInit } from '@angular/core';
import { Domain, Publisher } from '../publishers-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublisherService } from '../../../../../publisher.service';
@Component({
  selector: 'app-domain-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './domain-card.component.html',
  styleUrl: './domain-card.component.css',
})
export class DomainCardComponent implements OnInit {
  @Input() domain!: Domain;
  @Input() publishers!: Array<Publisher>;
  @Input() publisherName!: string;
  isEdit: boolean = false;
  _domain!: Domain;
  data: Array<Publisher> = [];
  errorMessage: string = '';

  constructor(private publisherService: PublisherService) {}

  ngOnInit(): void {
    if (!this.publisherName) {
      console.error('Publisher name is not defined');
      this.errorMessage = 'Publisher name is not defined';
      return;
    }
    this._domain = JSON.parse(JSON.stringify(this.domain));
  }
  toggleEdit() {
    this.isEdit = !this.isEdit;
  }

  async editDomain() {
    const foundPublisher = this.publishers.find((publisher) =>
      publisher.domains.some(
        (d) => d.domain === this._domain.domain && d !== this.domain
      )
    );

    if (!foundPublisher) {
      try {
        const updatedDomain = await this.publisherService.updateDomain(
          this.publisherName,
          this.domain.domain,
          this._domain,
          this._domain.domain
        );

        this.domain.domain = this._domain.domain;
        this.domain.desktopAds = this._domain.desktopAds;
        this.domain.mobileAds = this._domain.mobileAds;
        this.toggleEdit();
      } catch (error) {
        this.errorMessage =
          'An error occurred while updating the domain. Please try again.';
        console.error(
          `Error updating domain ${this.domain.domain} for publisher ${this.publisherName}:`,
          error
        );
      }
    } else {
      alert(
        'This domain is already configured on publisher ' +
          foundPublisher.publisher
      );
    }
  }

  async deleteDomain() {
    if (confirm('Are you sure you want to delete this domain?')) {
      try {
        await this.publisherService.deleteDomain(
          this.publisherName,
          this.domain.domain
        );

        const foundPublisher = this.publishers.find(
          (p) => p.publisher === this.publisherName
        );
        if (foundPublisher) {
          foundPublisher.domains = foundPublisher.domains.filter(
            (d) => d.domain !== this.domain.domain
          );
          if (foundPublisher.domains.length === 0) {
            location.reload();
          }
        }
      } catch (error) {
        this.errorMessage =
          'An error occurred while deleting the domain. Please try again.';
        console.error(
          `Error deleting domain ${this.domain.domain} for publisher ${this.publisherName}:`,
          error
        );
      }
    }
  }
}
