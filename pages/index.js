import React from 'react'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import axios from 'axios'
import './App.scss'
import { Button } from 'carbon-components-react'
import { FileUploader } from 'carbon-components-react'

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null,
      fileStatus: 'edit'
    }
  }

  convertCSV2JSON = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('csv', this.state.file)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      responseType: 'blob'
    }
    const res = await axios.post('/csv-to-json', formData, config)
    if (res.data) {
      this.setState({json:res.data.content})

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${res.headers['file-name']}.json`);
      document.body.appendChild(link);
      link.click();
      // clear the file
      this.setState({fileStatus: 'complete'})
    }
  }

  handleChange = e => {
    // const { name } = e.target.files
    e.preventDefault()
    const csv = e.target.files[0]
    this.updateState(csv)
  }

  updateState = (payload) => {
    this.setState({file:payload})
  }

  render () {
    return (
      <div>
        <Head title="CSV 2 JSON Converter"></Head>
        <div className="bx--grid">
          <div className="bx--row">
            <div className="bx--col">
              <h1 className="title">CSV - JSON Tool</h1>
        
              <form onSubmit={this.convertCSV2JSON} encType="multipart/form-data">
                <FileUploader 
                  labelTitle="Upload your csv"
                  labelDescription="only one csv file per usage"
                  buttonLabel="Add File"
                  name="csv"
                  onChange={this.handleChange}
                  accept={['.csv']}
                  filenameStatus={this.state.fileStatus}
                  tabIndex={1}
                >
                </FileUploader>
                <Button type="submit">
                  Convert
                </Button>
                <pre>{JSON.stringify(this.state.json)}</pre>
              </form>
            </div>
          </div>
        </div>
      </div>
    ) 
  }
}

export default Index;
