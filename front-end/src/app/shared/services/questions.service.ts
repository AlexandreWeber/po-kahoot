import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor() { }

	public getQuestions(type): Promise<Array<any>> {
		return new Promise(async (resolve) => {
			const url = type === 'front' ? 'https://firebasestorage.googleapis.com/v0/b/kahoot-315c5.appspot.com/o/front.json?alt=media&token=f46f6bcf-655d-4494-9357-6068f4d8be07'
																	 : '';
			const response = await fetch(url);
			const json = await response.json();

			resolve(json);
		})
	}
}
