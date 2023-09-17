import {Component} from '@angular/core';
import {comment} from "postcss";
import {Store} from "../../../../core/mvi/store";
import {EditorState} from "./state/editor-state";
import {EditorResultAction} from "./state/editor-result-action";
import {EditorAction, EditorActionType} from "./state/editor-action";
import {EditorExecutor} from "./state/editor-executor";
import {EditorReducer} from "./state/editor-reducer";
import {HtmlDocumentParser} from "../../domain/html-document-parser";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent extends Store<EditorState, EditorExecutor, EditorAction, EditorResultAction> {

  cursorPosition = 0

  constructor(
    state: EditorState,
    executor: EditorExecutor,
    reducer: EditorReducer,
  ) {
    super(state, executor, reducer);
    this.subscribeToUpdateHtml()
  }

  private subscribeToUpdateHtml() {
    const div = document.querySelector('div');
    const self = this
    const divMO = new window.MutationObserver(function (e) {
      const parent = document.getElementById("parent")
      const position = self.getCursorPosition(parent)

      if (position != 0) {
        self.cursorPosition = position
      }

      if (parent != null) {
        self.performAction({
          type: EditorActionType.UPDATE_DOCUMENT,
          element: parent
        })
      }

      // Переписать хак с установкой курсора
      // например можно чекать не позицию а что обновляется
      // и если весь документ восстанавливать позицию
      if (position == 0) {
        self.setCursorPosition(self.cursorPosition)
      }
    });

    if (div != null) {
      divMO.observe(div, {childList: true, subtree: true, characterData: true});
    }
  }

  getCursorPosition(parent: any) {
    const selection = document.getSelection()
    if (selection == null) return 0
    const range = new Range()
    range.setStart(parent, 0)

    const anchorNode = selection.anchorNode
    if (anchorNode == null) return 0
    range.setEnd(anchorNode, selection.anchorOffset)
    return range.toString().length
  }

  setCursorPosition(position: number) {
    const parent = document.getElementById("parent")
    if (parent == null) return
    let child = parent.firstChild

    while (position > 0) {
      let length = child?.textContent?.length

      if (length == undefined) return;

      if (position > length) {
        position -= length
        child = child!.nextSibling
      } else {
        if (child!.nodeType == 3) {
          child?.parentElement?.focus()
          document?.getSelection()?.collapse(child, position)
          return
        }

        child = child!.firstChild
      }
    }
  }

  findPatches() {
    // console.log(compare(this.startDoc, this.doc))
    // this.startDoc = clone(this.doc)
  }

  protected readonly comment = comment;
  protected readonly EditorActionType = EditorActionType;
}
