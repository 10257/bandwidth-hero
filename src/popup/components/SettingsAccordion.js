import React from 'react'
import { Segment, Accordion, Icon } from 'semantic-ui-react'
import ManageDisabled from './ManageDisabled'
import CompressionSettings from './CompressionSettings'

export default ({
  disabledHosts,
  disabledOnChange,
  convertBw,
  compressionLevel,
  proxyUrl,
  convertBwOnChange,
  compressionLevelOnChange,
  proxyUrlOnChange,
  proxyUrlOnReset
}) => {
  return (
    <Segment attached>
      <Accordion>
        <Accordion.Title>
          <Icon name="dropdown" />
          Manage disabled sites
        </Accordion.Title>
        <Accordion.Content>
          <ManageDisabled disabledHosts={disabledHosts} onChange={disabledOnChange} />
        </Accordion.Content>
        <Accordion.Title>
          <Icon name="dropdown" />
          Compression settings
        </Accordion.Title>
        <Accordion.Content>
          <CompressionSettings
            convertBw={convertBw}
            compressionLevel={compressionLevel}
            proxyUrl={proxyUrl}
            onConvertBwChange={convertBwOnChange}
            onCompressionLevelChange={compressionLevelOnChange}
            onUrlChange={proxyUrlOnChange}
            onUrlReset={proxyUrlOnReset}
          />
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}
