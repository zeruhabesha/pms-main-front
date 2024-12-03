import React from 'react';
import { Card, CardBody, CardText, CardTitle, CardFooter } from 'reactstrap'; // CoreUI components
import { FaStar } from 'react-icons/fa';

const testimonialsData = [
  {
    name: 'John Doe',
    feedback: 'BetaPMS has transformed the way I manage my properties. The platform is easy to use and has saved me so much time.',
    rating: 5,
  },
  {
    name: 'Jane Smith',
    feedback: 'The customer support is top-notch. They helped me get set up quickly and answered all my questions.',
    rating: 4,
  },
  {
    name: 'Sam Wilson',
    feedback: 'Managing tenant payments and lease agreements has never been easier. Highly recommend BetaPMS!',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center">What Our Clients Say</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonialsData.map((testimonial, index) => (
          <Card key={index} className="shadow-lg">
            <CardBody>
              <CardTitle tag="h5">{testimonial.name}</CardTitle>
              <CardText>"{testimonial.feedback}"</CardText>
              <CardFooter>
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar
                      key={i}
                      className={`text-yellow-500 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </CardFooter>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
