import {Injectable} from "@angular/core";
import {
  ImageParagraph,
  LongreadDocument,
  ParagraphTypeConsts,
  TextParagraph,
  TextSpan,
  TextStyle
} from "./models/models";
import {BOLD, CURSIVE, FontSize, SEPARATOR, SIZE_24, SIZE_30} from "./style-const";

@Injectable({
  providedIn: 'root',
})
export class DocumentParser {

  space = "&nbsp"

  constructor() {
    this.addGlobalStyles()
  }

  parse(longreadDocument: LongreadDocument, isDropdownMenuVisibleSet: Set<string>) {
    const doc = document.createElement("div")
    let element = document.createElement("div");

    this.addTitle(doc, longreadDocument.title)

    if (longreadDocument.paragraphs.length == 0) {
      longreadDocument.paragraphs.push(new TextParagraph(ParagraphTypeConsts.text, [new TextSpan("")]))
    }

    longreadDocument.paragraphs.forEach((paragraph, paragraphIndex) => {
      if (paragraph.type == ParagraphTypeConsts.text) {
        const textParagraph = paragraph as TextParagraph

        textParagraph.spans.forEach((textSpan, index) => {
          this.addTextSpanElement(element, textSpan, index == 0 && paragraphIndex == 0 && longreadDocument.paragraphs.length == 1 && (longreadDocument.paragraphs[0] as TextParagraph).spans.length == 1)
        })

      } else if (paragraph.type == ParagraphTypeConsts.image) {
        this.addImage(paragraph, doc)
      }

      element.setAttribute("ed-type", paragraph.type.toString())
      element.setAttribute("class", "mt-4 ms-12 me-12 min-w-full")
      doc.appendChild(element)
      this.addMenu(paragraphIndex, doc, isDropdownMenuVisibleSet)
      element = document.createElement("div")
    })

    return doc.innerHTML
  }

  private addTitle(doc: HTMLElement, title: string) {
    const titleElement = document.createElement("div")
    titleElement.innerHTML = title
    titleElement.setAttribute("class", "font-bold text-5xl mt-4 mb-4 ms-12 me-12 w-max min-w-full")
    titleElement.setAttribute("ed-type",  ParagraphTypeConsts.title)
    titleElement.setAttribute("contenteditable", "true")
    titleElement.setAttribute("data-placeholder", "Заголовок")
    titleElement.id = "ed_title"

    doc.appendChild(titleElement)
  }

  private addTextSpanElement(element: HTMLElement, textSpan: TextSpan, isFirstSpan: boolean) {
    const textDivElement = document.createElement("span")

    let text = textSpan.text

    if (text.length == 0 && !isFirstSpan) {
      text = "<br>"
    }

    textDivElement.innerHTML = text

    if (textSpan.style != undefined) {
      this.addTextStyle(textDivElement, textSpan.style)
    }

    if (isFirstSpan) {
      textDivElement.setAttribute("span-data-placeholder", "Просто начни")
      textDivElement.setAttribute("class", "newParagraphPlaceholder")
    }

    element.appendChild(textDivElement)
  }

  private addTextStyle(element: HTMLElement, style: TextStyle) {
    let styleClass = ""

    if (style.hasOwnProperty('bold') && style.bold) {
      styleClass += BOLD
    }

    if (style.hasOwnProperty('cursive') && style.cursive) {
      styleClass += SEPARATOR + CURSIVE
    }

    if (style.hasOwnProperty('size')) {
      styleClass += SEPARATOR

      if (style.size === FontSize.SIZE_24) {
        styleClass += SIZE_24
      } else if (style.size === FontSize.SIZE_30) {
        styleClass += SIZE_30
      }
    }

    element.setAttribute("class", styleClass)
  }

  private addImage(paragraph: TextParagraph | ImageParagraph, doc: HTMLElement) {
    const imageParagraph = paragraph as ImageParagraph

    const imageDivElement = document.createElement("div")
    imageDivElement.setAttribute("class", "flex flex-col")

    const imageElement = document.createElement("img")
    imageElement.setAttribute("class", "place-self-center")
    imageElement.setAttribute("src", imageParagraph.url)
    imageElement.setAttribute("title", "")
    imageDivElement.appendChild(imageElement)

    const textDivElement = document.createElement("div")
    textDivElement.innerHTML = imageParagraph.description
    textDivElement.setAttribute("class", "place-self-center")
    imageDivElement.appendChild(textDivElement)
    doc.appendChild(imageDivElement)
  }

  private addMenu(paragraphIndex: number, doc: HTMLElement, isDropdownMenuVisibleSet: Set<string>) {
    const menuDiv = document.createElement("div")
    menuDiv.setAttribute("class", "relative inline-block text-left space-x-3 w-fit bottom-8")
    menuDiv.setAttribute("contenteditable", "false")

    const buttonDiv = document.createElement("div")
    const button = document.createElement("button")

    button.id = "menu-button-" + paragraphIndex
    button.setAttribute("class", "py-2 px-2 rounded-full hover:bg-gray-200 hover:text-white transition duration-300")

    const svg = document.createElement("svg")
    svg.setAttribute("width", "24")
    svg.setAttribute("height", "25")
    svg.setAttribute("viewBox", "0 0 24 25")
    svg.setAttribute("fill", "none")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    button.appendChild(svg)

    const path = document.createElement("path")
    path.setAttribute("d", "M12 24.293C10.3906 24.293 8.875 23.9844 7.45312 23.3672C6.03906 22.7578 4.78906 21.9141 3.70312 20.8359C2.625 19.75 1.77734 18.5 1.16016 17.0859C0.550781 15.6641 0.246094 14.1484 0.246094 12.5391C0.246094 10.9297 0.550781 9.41797 1.16016 8.00391C1.77734 6.58203 2.625 5.33203 3.70312 4.25391C4.78125 3.16797 6.02734 2.32031 7.44141 1.71094C8.86328 1.09375 10.3789 0.785156 11.9883 0.785156C13.5977 0.785156 15.1133 1.09375 16.5352 1.71094C17.957 2.32031 19.207 3.16797 20.2852 4.25391C21.3633 5.33203 22.2109 6.58203 22.8281 8.00391C23.4453 9.41797 23.7539 10.9297 23.7539 12.5391C23.7539 14.1484 23.4453 15.6641 22.8281 17.0859C22.2109 18.5 21.3633 19.75 20.2852 20.8359C19.207 21.9141 17.957 22.7578 16.5352 23.3672C15.1211 23.9844 13.6094 24.293 12 24.293ZM12 22.7812C13.4141 22.7812 14.7383 22.5156 15.9727 21.9844C17.2148 21.4531 18.3047 20.7188 19.2422 19.7812C20.1875 18.8438 20.9219 17.7578 21.4453 16.5234C21.9766 15.2812 22.2422 13.9531 22.2422 12.5391C22.2422 11.125 21.9766 9.80078 21.4453 8.56641C20.9141 7.32422 20.1797 6.23438 19.2422 5.29688C18.3047 4.35156 17.2148 3.61719 15.9727 3.09375C14.7383 2.5625 13.4102 2.29688 11.9883 2.29688C10.5742 2.29688 9.24609 2.5625 8.00391 3.09375C6.76953 3.61719 5.68359 4.35156 4.74609 5.29688C3.81641 6.23438 3.08594 7.32422 2.55469 8.56641C2.03125 9.80078 1.76953 11.125 1.76953 12.5391C1.76953 13.9531 2.03125 15.2812 2.55469 16.5234C3.08594 17.7578 3.82031 18.8438 4.75781 19.7812C5.69531 20.7188 6.78125 21.4531 8.01562 21.9844C9.25 22.5156 10.5781 22.7812 12 22.7812ZM6.66797 12.5391C6.66797 12.3125 6.73828 12.1289 6.87891 11.9883C7.01953 11.8477 7.20703 11.7773 7.44141 11.7773H11.2383V7.96875C11.2383 7.74219 11.3086 7.55859 11.4492 7.41797C11.5898 7.26953 11.7656 7.19531 11.9766 7.19531C12.2031 7.19531 12.3867 7.26562 12.5273 7.40625C12.668 7.54688 12.7383 7.73438 12.7383 7.96875V11.7773H16.5586C16.7773 11.7773 16.957 11.8477 17.0977 11.9883C17.2383 12.1289 17.3086 12.3125 17.3086 12.5391C17.3086 12.75 17.2383 12.9258 17.0977 13.0664C16.957 13.1992 16.7773 13.2656 16.5586 13.2656H12.7383V17.0859C12.7383 17.3125 12.668 17.4961 12.5273 17.6367C12.3867 17.7773 12.2031 17.8477 11.9766 17.8477C11.7656 17.8477 11.5898 17.7773 11.4492 17.6367C11.3086 17.4883 11.2383 17.3047 11.2383 17.0859V13.2656H7.44141C7.21484 13.2656 7.02734 13.1992 6.87891 13.0664C6.73828 12.9258 6.66797 12.75 6.66797 12.5391Z")
    path.setAttribute("fill", "#5E5E5E")

    svg.appendChild(path)
    buttonDiv.appendChild(button)
    menuDiv.appendChild(buttonDiv)

    return
    const dropDownDiv = document.createElement("div")
    dropDownDiv.setAttribute("class", "absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none")
    dropDownDiv.setAttribute("role", "menu")
    dropDownDiv.setAttribute("aria-orientation", "vertical")
    dropDownDiv.setAttribute("aria-labelledby", "menu-button")
    dropDownDiv.setAttribute("tabindex", "-1")
    dropDownDiv.id = "menu-drop-down-" + paragraphIndex

    this.createDropDownDivPart(dropDownDiv)
    menuDiv.appendChild(dropDownDiv)

    doc.appendChild(menuDiv)
  }

  private createDropDownDivPart(dropDownDiv: HTMLElement) {
    const dropDownDivPart1 = document.createElement("div")
    this.createDropDownAText(dropDownDivPart1, "menu-item-0", "Текст")
    this.createDropDownAText(dropDownDivPart1, "menu-item-1", "Заголовок 1")
    this.createDropDownAText(dropDownDivPart1, "menu-item-2", "Заголовок 2")
    this.createDropDownAText(dropDownDivPart1, "menu-item-3", "Маркерованный список")
    this.createDropDownAText(dropDownDivPart1, "menu-item-4", "Нумерованный список")
    dropDownDiv.appendChild(dropDownDivPart1)

    const dropDownDivPart2 = document.createElement("div")
    this.createDropDownAText(dropDownDivPart2, "menu-item-5", "Изображение")
    this.createDropDownAText(dropDownDivPart2, "menu-item-6", "Видео")
    dropDownDiv.appendChild(dropDownDivPart2)
  }

  private createDropDownAText(dropDownDiv: HTMLElement, id: string, text: string) {
    const dropDownAText = document.createElement("a")
    dropDownAText.setAttribute("class", "text-gray-700 block px-4 py-2 text-sm hover:bg-gray-200 transition duration-300")
    dropDownAText.setAttribute("role", "menuitem")
    dropDownAText.setAttribute("tabindex", "-1")
    dropDownAText.setAttribute("id", id)
    dropDownAText.textContent = text

    dropDownDiv.appendChild(dropDownAText)
  }

  private addGlobalStyles() {
    const style = document.createElement('style')
    style.innerHTML = `
        div:empty:before {
          content:attr(data-placeholder);
          color:gray
        }
        .newParagraphPlaceholder {
          display: inline-block;
          outline: none
        }

        .newParagraphPlaceholder:empty::before {
          content: attr(span-data-placeholder);
          color: grey;
        }
    `
    document.head.appendChild(style)
  }

}
