import { Pipe, PipeTransform } from '@angular/core';

const ASSET_HOST = (window as any).env.ASSET_HOST;

/**
 * Returns a complete asset url for a given asset path.
 */
@Pipe({
  name: 'asset'
})
export class AssetPipe implements PipeTransform {
  transform(path: string): string {
    return `${ASSET_HOST}${path}`;
  }
}
