import { Component, OnInit } from '@angular/core';
import { PublisherCardComponent } from './publisher-card/publisher-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublisherService } from '../../../../publisher.service';
export type Publisher = {
  publisher: string;
  domains: Array<Domain>;
};

export type Domain = {
  domain: string;
  desktopAds: number;
  mobileAds: number;
};

@Component({
  selector: 'app-publishers-container',
  standalone: true,
  imports: [PublisherCardComponent, CommonModule, FormsModule],
  templateUrl: './publishers-container.component.html',
  styleUrl: './publishers-container.component.css',
})
export class PublishersContainerComponent implements OnInit {
  isDomain: boolean = false;
  isPublisher: boolean = false;
  publisherName: string = '';
  newPublisher: string = '';
  data: Array<Publisher> = [];
  constructor(private publisherService: PublisherService) {}

  async ngOnInit() {
    this.data = await this.publisherService.getPublishers();
  }

  async addPublisher() {
    const newPublisher = this.publisherName;

    try {
      const addedPublisher = await this.publisherService.addPublisher(
        newPublisher
      );
      this.data.push(addedPublisher);
      this.publisherName = '';
      this.isPublisher = false;
    } catch (error) {
      console.error('Error adding publisher:', error);
    }
  }
  toggleDomain() {
    this.isDomain = !this.isDomain;
  }
  togglePublisher() {
    this.isPublisher = !this.isPublisher;
  }

  async addDomain() {
    const newPublisherName = this.publisherName;
    const newDomain = {
      domain: 'example.com',
      desktopAds: 0,
      mobileAds: 0,
    };
    const addedDomain = await this.publisherService.addDomain(
      newPublisherName,
      newDomain
    );
    const foundPublisher = this.data.find(
      (p) => p.publisher === this.publisherName
    );
    if (foundPublisher) {
      foundPublisher.domains.push(addedDomain);
      this.isDomain = false;
      this.publisherName = '';
    } else {
      console.warn('Publisher with specified domain not found.');
    }
  }
}
