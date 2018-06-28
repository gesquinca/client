// @flow
import * as I from 'immutable'
import React from 'react'
import * as Types from '../constants/types/fs'
import * as Constants from '../constants/fs'
import {type ConnectedProps as ConnectedUsernamesProps} from '../common-adapters/usernames'
import {action, storiesOf, createPropProvider} from '../stories/storybook'
import {globalStyles, globalColors, globalMargins} from '../styles'
import Files from '.'
import ConnectedStillRow from './row/still-container'
import StillRow from './row/still'
import EditingRow from './row/editing'
import PlaceholderRow from './row/placeholder'
import UploadingRow from './row/uploading'
import {NormalPreview} from './filepreview'
import {Box} from '../common-adapters'
import Download from './footer/download'
import PathItemAction from './common/path-item-action'
import Breadcrumb from './header/breadcrumb.desktop'
import Banner from './banner'

const folderItemStyles = {
  iconSpec: {
    type: 'basic',
    iconType: 'icon-folder-private-32',
    iconColor: globalColors.darkBlue2,
  },
  textColor: globalColors.darkBlue,
  textType: 'BodySemibold',
}

const fileItemStyles = {
  iconSpec: {
    type: 'basic',
    iconType: 'icon-file-private-32',
    iconColor: globalColors.darkBlue2,
  },
  textColor: globalColors.darkBlue,
  textType: 'Body',
}

const rowProviders = {
  Row: ({path, routePath}) => ({
    pathItemType: 'folder',
    path,
    routePath,
  }),
  ConnectedStillRow: ({path}: {path: Types.Path}) => {
    const pathStr = Types.pathToString(path)
    const hasAbc = pathStr.includes('abc')
    const hasDef = pathStr.includes('def')
    const hasGhi = pathStr.includes('ghi')
    return {
      name: Types.getPathName(path),
      onOpen: () => {},
      openInFileUI: () => {},
      type: 'folder',
      shouldShowMenu: true,
      itemStyles: folderItemStyles,
      onAction: action('onAction'),
      resetParticipants: [
        ...(hasAbc ? ['abc'] : []),
        ...(hasDef ? ['def'] : []),
        ...(hasGhi ? ['ghi'] : []),
      ],
      isUserReset: false,
    }
  },
}

const provider = createPropProvider({
  ...rowProviders,
  Footer: () => ({
    downloads: [],
  }),
  FolderHeader: () => ({
    breadcrumbItems: [
      {
        name: 'keybase',
        path: '/keybase',
      },
    ],
    dropdownItems: [],
    isTeamPath: false,
    path: Types.stringToPath('/keybase'),
    onBack: action('onBack'),
    onOpenBreadcrumb: action('onOpenBreadcrumb'),
    onOpenBreadcrumbDropdown: action('onOpenBreadcrumbDropdown'),
  }),
  ConnectedBreadcrumb: () => ({
    dropdownItems: undefined,
    shownItems: [],
  }),
  SortBar: ({path}: {path: Types.Path}) => ({
    sortSetting: {
      sortBy: 'name',
      sortOrder: 'asc',
    },
    onOpenSortSettingPopup: () => {},
    folderIsPending: true,
  }),
  FilesBanner: () => ({
    path: Types.stringToPath('/keybase'),
    kbfsEnabled: true,
    showBanner: false,
    inProgress: false,
    showSecurityPrefs: false,
    getFuseStatus: action('getFuseStatus'),
    onDismiss: action('onDismiss'),
    onInstall: action('onInstall'),
    onUninstall: action('onUninstall'),
  }),
  FilePreviewDefaultView: () => ({
    fileUIEnabled: false,
    pathItem: Constants.makeFile({
      name: 'bar.jpg',
      size: 10240,
      lastWriter: {uid: '', username: 'foo'},
    }),
    itemStyles: Constants.getItemStyles(['keybase', 'private', 'foo', 'bar.jpg'], 'file', 'foo'),
    onDownload: () => {},
    onShowInFileUI: () => {},
    onShare: () => {},
    onSave: () => {},
  }),
  FilePreviewHeader: () => ({
    pathItem: Constants.makeFile({
      name: 'bar.jpg',
      size: 10240,
      lastWriter: {uid: '', username: 'foo'},
    }),
    onAction: () => {},
    onBack: () => {},
    onShowInFileUI: () => {},
    loadFilePreview: () => {},
    path: '/keybase/private/foo/bar.jpg',
  }),
  ViewContainer: () => ({
    url: '/keybase/private/foo/bar.jpg',
    mimeType: 'jpg',
    isSymlink: false,
    path: '/keybase/private/foo/bar.jpg',
    onInvalidToken: action('onInvalidToken'),
    loadMimeType: action('loadMimeType'),
  }),
  ResetBanner: ({path}: {path: Types.Path}) => ({
    isUserReset: Types.pathToString(path) === '/keybase/private/me,reset',
    resetParticipants: ['reset1', 'reset2', 'reset3'],
    onReAddToTeam: () => () => undefined,
    onViewProfile: () => () => undefined,
  }),
  Banner: ({path}: {path: Types.Path}) => ({
    path,
    shouldShowReset: Types.pathToString(path).includes('reset'),
  }),
  Usernames: (props: ConnectedUsernamesProps) => ({
    ...props,
    users: props.usernames.map(u => ({username: u})),
  }),
  ConnectedAddNew: () => ({
    pathElements: [],
    style: {},
    menuItems: [],
  }),
  ConnectedPathItemAction: () => pathItemActionPopupProps(Types.stringToPath('/keybase/private/meatball')),
})

const downloadCommonActions = {
  open: action('open'),
  dismiss: action('dismiss'),
  cancel: action('cancel'),
}

const pathItemActionPopupProps = (path: Types.Path) => {
  const pathElements = Types.getPathElements(path)
  return {
    size: 0,
    type: 'folder',
    lastModifiedTimestamp: 0,
    lastWriter: 'meatball',
    childrenFolders: 0,
    childrenFiles: 0,
    itemStyles: Constants.getItemStyles(pathElements, 'folder', 'meatball'),
    name: Types.getPathNameFromElems(pathElements),
    pathElements,
    menuItems: [
      {
        title: 'menu item',
        onClick: action('onClick'),
      },
    ],
    onHidden: action('onHidden'),
  }
}

const breadcrumbProps = (names: Array<string>) => {
  const items = names.map((name, idx) => ({
    isTeamTlf: idx === 2 && names[idx - 1] === 'team',
    isLastItem: idx === names.length - 1,
    name: name,
    path: Types.stringToPath('/' + names.slice(0, idx + 1).join('/')),
    iconSpec: Constants.getItemStyles(names.slice(0, idx + 1), 'folder', 'foo').iconSpec,
    onClick: action('onClick'),
  }))
  return items.length > 3
    ? {
        dropdownItems: items.slice(0, items.length - 2),
        shownItems: items.slice(items.length - 2),
      }
    : {
        dropdownItems: undefined,
        shownItems: items,
      }
}

const folderHeaderProps = (names: Array<string>) => ({
  breadcrumbItems: names
    .map((name, idx) => ({
      isTlfNameItem: idx === 2,
      isLastItem: idx === names.length - 1,
      name: name,
      path: Types.stringToPath('/' + names.slice(0, idx + 1).join('/')),
      onOpenBreadcrumb: action('onOpenBreadcrumb'),
    }))
    .slice(names.length > 3 ? names.length - 2 : 0),
  path: Types.stringToPath('/' + names.join('/')),
  openInFileUI: action('openInFileUI'),
})

const commonRowProps = {
  onSubmit: action('onSubmit'),
  onUpdate: action('onUpdate'),
  onCancel: action('onCancel'),
}

const load = () => {
  storiesOf('Files', module)
    .addDecorator(provider)
    .add('Root', () => (
      <Files
        path={Types.stringToPath('/keybase')}
        progress="loaded"
        routePath={I.List([])}
        isUserReset={false}
        resetParticipants={['foo']}
        stillItems={[
          Types.stringToPath('/keybase/private'),
          Types.stringToPath('/keybase/public'),
          Types.stringToPath('/keybase/team'),
        ]}
        editingItems={[]}
      />
    ))
    .add('Preview', () => (
      <NormalPreview
        routePath={I.List([])}
        routeProps={I.Map({
          path: '/keybase/private/foo/bar.jpg',
        })}
      />
    ))
    .add('Rows', () => (
      <Box>
        <ConnectedStillRow
          path={Types.stringToPath('/keybase/private/a')}
          routeProps={I.Map({path: '/keybase/private/foo'})}
          routePath={I.List([])}
        />
        <EditingRow
          name="New Folder (editing)"
          hint="New Folder (editing)"
          status="editing"
          itemStyles={folderItemStyles}
          isCreate={true}
          {...commonRowProps}
        />
        <EditingRow
          name="From Dropbox (rename) (editing)"
          hint="From Dropbox (rename) (editing)"
          status="editing"
          itemStyles={folderItemStyles}
          isCreate={false}
          {...commonRowProps}
        />
        <EditingRow
          name="New Folder (saving)"
          hint="New Folder (saving)"
          status="saving"
          itemStyles={folderItemStyles}
          isCreate={true}
          {...commonRowProps}
        />
        <EditingRow
          name="New Folder (failed)"
          hint="New Folder (failed)"
          status="failed"
          itemStyles={folderItemStyles}
          isCreate={true}
          {...commonRowProps}
        />
        <UploadingRow name="foo" itemStyles={fileItemStyles} />
        <UploadingRow name="foo" itemStyles={folderItemStyles} />
        <StillRow
          path={Types.stringToPath('/keybase/private/foo/bar')}
          name="bar"
          type="file"
          lastModifiedTimestamp={Date.now()}
          lastWriter="alice"
          shouldShowMenu={true}
          itemStyles={fileItemStyles}
          badgeCount={0}
          isDownloading={true}
          isUserReset={false}
          resetParticipants={[]}
          onOpen={action('onOpen')}
          openInFileUI={action('openInFileUI')}
          onAction={action('onAction')}
        />
        <PlaceholderRow />
      </Box>
    ))
    .add('Footer Cards', () => (
      <Box>
        <Box style={{height: 8}} />
        <Download
          filename="fjweio"
          completePortion={0.42}
          progressText="4 s"
          isDone={false}
          {...downloadCommonActions}
        />
        <Box style={{height: 8}} />
        <Download
          filename="fjweio afiojwe fweiojf oweijfweoi fjwoeifj ewoijf oew"
          completePortion={0.42}
          progressText="4 s"
          isDone={false}
          {...downloadCommonActions}
        />
        <Box style={{height: 8}} />
        <Download
          filename="fjweioafiojwefweiojfoweijfweoifjwoeifjewoijfoew"
          completePortion={0.42}
          progressText="4 s"
          isDone={false}
          {...downloadCommonActions}
        />
        <Box style={{height: 8}} />
        <Download
          filename="fjweioafiojwefweiojfoweijfweoifjwoeifjewoijfoew"
          completePortion={0.42}
          progressText="59 min"
          isDone={false}
          {...downloadCommonActions}
        />
        <Box style={{height: 8}} />
        <Download
          filename="fjweioafiojwefweiojfoweijfweoifjwoeifjewoijfoew"
          completePortion={0.42}
          progressText="1234 hr"
          isDone={false}
          {...downloadCommonActions}
        />
        <Box style={{height: 8}} />
      </Box>
    ))
    .add('PathItemAction', () => (
      <Box style={{padding: globalMargins.small}}>
        <PathItemAction
          {...pathItemActionPopupProps(Types.stringToPath('/keybase/private/meatball/folder/treat'))}
        />
        <PathItemAction
          {...pathItemActionPopupProps(
            Types.stringToPath(
              '/keybase/private/meatball/treat treat treat treat treat treat treat treat treat treat treat treat treat treat treat treat'
            )
          )}
        />
        <PathItemAction
          {...pathItemActionPopupProps(
            Types.stringToPath(
              '/keybaes/private/meatball/foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar'
            )
          )}
        />
      </Box>
    ))
    .add('Breadcrumbs', () => (
      <Box>
        <Breadcrumb {...breadcrumbProps(['keybase', 'private', 'foo', 'bar'])} />
        <Breadcrumb {...breadcrumbProps(['keybase', 'private', 'foo'])} />
        <Breadcrumb
          {...breadcrumbProps([
            'keybase',
            'private',
            'foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo',
          ])}
        />
        <Breadcrumb
          {...breadcrumbProps([
            'keybase',
            'private',
            'foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar',
          ])}
        />
        <Breadcrumb
          {...breadcrumbProps([
            'keybase',
            'private',
            'foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo',
            'haha',
          ])}
        />
        <Breadcrumb
          {...breadcrumbProps([
            'keybase',
            'private',
            'foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar,foo,bar',
            'haha',
          ])}
        />
      </Box>
    ))
    .add('ResetRows', () => (
      <Files
        path={Types.stringToPath('/keybase')}
        progress="loaded"
        routePath={I.List([])}
        isUserReset={false}
        resetParticipants={[]}
        stillItems={[
          Types.stringToPath('/keybase/private/me'),
          Types.stringToPath('/keybase/private/me,abc'),
          Types.stringToPath('/keybase/private/me,abc,def'),
          Types.stringToPath('/keybase/private/me,abc,def,ghi'),
          Types.stringToPath('/keybase/private/me,def'),
          Types.stringToPath('/keybase/private/me,def,ghi'),
          Types.stringToPath('/keybase/private/me,ghi'),
          Types.stringToPath('/keybase/private/me,abc,ghi'),
        ]}
        editingItems={[]}
      />
    ))
    .add('ResetBanner', () => (
      <Box>
        <Banner
          path={Types.stringToPath('/keybase/private/me,reset1,reset2,reset3')}
          shouldShowReset={true}
        />
        <Box style={{height: 8}} />
        <Banner
          path={Types.stringToPath('/keybase/private/me,reset')}
          shouldShowReset={true}
        />
      </Box>
    ))
}

export default load
