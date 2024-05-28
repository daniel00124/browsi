import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PublisherService {
  private apiUrl = 'http://localhost:3000/api';

  async getPublishers() {
    const response = await axios.get(`${this.apiUrl}/publishers`);
    return response.data;
  }

  async addPublisher(publisher: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/publishers`, {
        publisher,
      });
      return response.data;
    } catch (error) {
      console.error('Error in addPublisher service method:', error);
      throw error;
    }
  }

  async addDomain(publisherName: string, domain: any) {
    const response = await axios.post(
      `${this.apiUrl}/publishers/${publisherName}/domains`,
      domain
    );
    return response.data;
  }

  async updateDomain(
    publisherName: string,
    domainName: string,
    domain: any,
    newName: any
  ) {
    try {
      const response = await axios.put(
        `${this.apiUrl}/publishers/${publisherName}/domains/${domainName}`,
        {
          newName,
          ...domain,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating domain ${domainName} for publisher ${publisherName}:`,
        error
      );
      throw error;
    }
  }

  async deleteDomain(publisherName: string, domainName: string) {
    try {
      const response = await axios.delete(
        `${this.apiUrl}/publishers/${publisherName}/domains/${domainName}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting domain ${domainName} for publisher ${publisherName}:`,
        error
      );
      throw error;
    }
  }
}
