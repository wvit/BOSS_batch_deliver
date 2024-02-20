/** 节点拓展方法 */
export interface DomExtensionMethods {
  /** 操作属性方法 */
  attr: <T>(key: string, value?: T) => T extends string ? Node : string
  /** 获取节点在浏览器的数据信息 */
  rect: () => object
  /** 添加子节点 */
  add: (child: Node) => Node
  /** 销毁当前节点 */
  destroy: () => Node
  /** 创建并添加子节点 */
  create: (tagName: string, attr: { [key: string]: any }) => Node
  /** 设置节点样式 */
  setStyle: (style: { [key: string]: string }) => Node
}

/** 普通节点类型 */
type Node = HTMLElement &
  Element &
  HTMLInputElement &
  DomExtensionMethods & {
    [key: string]: any
    style: any
  }

/** 节点列表类型 */
type NodeList = NodeListOf<Node>

/** 一些简化操作Dom的方法 */
export class Dom {
  /** 获取单个节点 */
  static query(select: string, parent?: Node | Document): Node {
    const node = (parent || document).querySelector(select) as Node
    return Dom.setMethods(node)
  }

  /** 获取多个节点 */
  static queryAll(select: string, parent?: Node): NodeList {
    const nodeList = (parent || document).querySelectorAll(select) as NodeList
    nodeList.forEach(node => Dom.setMethods(node))
    return nodeList
  }

  /** 创建节点 */
  static create(tagName: string, attrs: { [key: string]: any } = {}): Node {
    const node = document.createElement(tagName) as Node
    Object.keys(attrs).forEach(key => {
      node[key] = attrs[key]
    })
    return Dom.setMethods(node)
  }

  /** 设置style */
  static setStyle(node: Node, style: { [key: string]: string }): Node {
    Object.keys(style).forEach(key => {
      node.style[key] = style[key]
    })
    return node
  }

  /** 在节点上挂载一些简写方法,方便链式调用 */
  static setMethods(node: Node): Node {
    if (!node) return node

    node.attr = (key: string, value?: unknown): any => {
      if (value) {
        node.setAttribute(key, value as string)
        return node
      } else {
        return node.getAttribute(key)
      }
    }

    /** 获取元素相对于浏览器的信息 */
    node.rect = () => node.getBoundingClientRect()

    /** 添加子节点 */
    node.add = child => {
      node.appendChild(child)
      return node
    }

    /** 销毁当前节点 */
    node.destroy = () => {
      node.parentNode?.removeChild(node)
      return node
    }

    /** 创建并添加子节点 */
    node.create = function (tagName: string, attrs: { [key: string]: any }) {
      const tag = Dom.create(tagName, attrs)
      this.add(tag)
      return tag
    }

    /** 设置节点样式 */
    node.setStyle = function (style: { [key: string]: string }) {
      Dom.setStyle(this, style)
      return this
    }

    return node
  }
}
